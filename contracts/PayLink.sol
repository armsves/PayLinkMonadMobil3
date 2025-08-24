// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PayLinkNative — Pagos nativos en Monad para PayLinks
/// @notice Acepta pagos en el token nativo (p.ej. MON/ETH-like) y reenvía fondos al tesoro.
contract PayLinkNative {
    /// @dev Dirección que recibe los pagos del vendedor
    address public immutable treasury;

    /// @dev (Opcional) destinatario de comisión de plataforma
    address public immutable feeRecipient;

    /// @dev Comisión en basis points (1% = 100). Máx 10000 (100%). Puede ser 0.
    uint16 public immutable feeBps;

    /// @notice Emitted on each successful payment
    /// @param buyer      comprador que pagó
    /// @param resourceId identificador del recurso (string corto, ej. nanoid)
    /// @param amount     monto total enviado (msg.value)
    /// @param ts         timestamp del bloque
    /// @param fee        comisión cobrada (si feeBps>0), en nativo
    event PaymentReceived(address indexed buyer, string resourceId, uint256 amount, uint256 ts, uint256 fee);

    error ZeroAddress();
    error InvalidBps();
    error NoValue();
    error TransferFailed();

    constructor(address _treasury, address _feeRecipient, uint16 _feeBps) {
        if (_treasury == address(0)) revert ZeroAddress();
        if (_feeBps > 10_000) revert InvalidBps();
        treasury = _treasury;
        feeRecipient = _feeRecipient; // puede ser address(0) para desactivar comisiones
        feeBps = _feeBps;             // puede ser 0
    }

    /// @notice Paga un recurso identificado por `resourceId` enviando valor nativo
    /// @dev El precio se valida off-chain (backend) comparando `amount` con el esperado.
    ///      Esto mantiene el contrato minimalista para hackathon.
    function pay(string calldata resourceId) external payable {
        if (msg.value == 0) revert NoValue();

        uint256 fee = 0;
        if (feeRecipient != address(0) && feeBps > 0) {
            fee = (msg.value * feeBps) / 10_000;
        }
        uint256 payout = msg.value - fee;

        // Paga al tesoro (vendedor)
        (bool ok1, ) = payable(treasury).call{value: payout}("");
        if (!ok1) revert TransferFailed();

        // Paga la comisión (si aplica)
        if (fee > 0) {
            (bool ok2, ) = payable(feeRecipient).call{value: fee}("");
            if (!ok2) revert TransferFailed();
        }

        emit PaymentReceived(msg.sender, resourceId, msg.value, block.timestamp, fee);
    }

    /// @dev Evita recibir fondos sin `resourceId` accidentalmente
    receive() external payable {
        revert();
    }
}
