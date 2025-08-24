# PayLink — Monad Farcaster MiniApp

PayLink convierte cualquier cast de Farcaster en un checkout instantáneo con pagos nativos en Monad. Vende ebooks, entradas, NFTs, suscripciones y más, todo sin salir del feed.

---

## 🚀 ¿Qué es PayLink?

PayLink permite a cualquier creador compartir un link en Farcaster y recibir pagos nativos en Monad. El usuario abre el link, paga en segundos y recibe acceso inmediato a su contenido digital.

- **Checkout nativo en Farcaster Frames**
- **Pagos ultrarrápidos en Monad (token nativo)**
- **Entrega automática de links secretos o NFTs**
- **UX sin fricción, sin salir de Farcaster**

---

## 🏗️ Estructura del Proyecto

```
paylink/
│── contracts/    # Smart contract PayLinkNative (Solidity)
│── backend/      # API serverless para validar pagos y entregar contenido
│── frontend/     # Next.js + Tailwind + Frame de pago
│── assets/       # Logo, banners y arte
│── pitch/        # Presentación y demo
```

---

## ⚡ Quickstart

### 1. Clona el repo

```bash
git clone https://github.com/monad-developers/paylink.git
cd paylink
```

### 2. Instala dependencias

```bash
yarn
```

### 3. Copia las variables de entorno

```bash
cp .env.example .env.local
```
Edita `.env.local` y pon la dirección del contrato PayLinkNative desplegado en Monad:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1AF0019ED1655f47FAB07750AA26e7C18C81EE44
```

### 4. Levanta frontend y backend

```bash
yarn dev
# o en dos terminales:
cd frontend && yarn dev
cd backend && yarn dev
```

### 5. Expon tu app para pruebas en Warpcast

Usa [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) o [ngrok](https://ngrok.com/) para exponer tu localhost:

```bash
cloudflared tunnel --url http://localhost:3000
```
Pon la URL generada en tu `.env.local` como `NEXT_PUBLIC_URL`.

---

## 🧩 ¿Cómo funciona?

1. **Creador** publica un cast con su PayLink (ej: `paylink.xyz/book123`).
2. **Comprador** abre el cast → Frame muestra producto y botón “Pagar con Monad”.
3. **Pago**: El usuario paga nativo (MON) al contrato PayLinkNative.
4. **Confirmación**: El backend detecta el evento on-chain y desbloquea el recurso (link secreto, NFT, etc).
5. **Todo sin salir de Farcaster**.

---

## 📝 Smart Contract

- [`contracts/PayLinkNative.sol`](contracts/PayLinkNative.sol)
- Recibe pagos nativos (MON), reenvía al vendedor y emite evento `PaymentReceived`.
- Comisión opcional para plataforma.
- Seguro y minimalista para hackathon.

---

## 🖼️ Frontend

- [`frontend/`](frontend/)
- Next.js + Tailwind + Frame para Farcaster.
- Checkout con botón “Pagar con Monad”.
- Muestra link secreto tras pago exitoso.

---

## 🛠️ Backend

- [`backend/`](backend/)
- API serverless (Express/Supabase Functions).
- Endpoints:
  - `POST /create-link` — genera PayLink único.
  - `POST /verify-payment` — valida pago on-chain.
  - `GET /secret/:id` — entrega recurso desbloqueado.

---

## 🎨 Branding

- Logo y banner en [`assets/`](assets/)
- Colores: azul eléctrico, negro mate, blanco.
- Slogan: **“Convierte cualquier cast en un checkout.”**

---

## 🏁 Demo Rápida

1. Publica un cast con tu PayLink.
2. Abre el frame, paga con Monad.
3. Recibe acceso instantáneo al contenido.

---

## 📦 Archivos clave

- `contracts/PayLinkNative.sol` — Smart contract de pagos nativos.
- `frontend/components/PayFrame.tsx` — Frame de pago.
- `backend/routes/payment.ts` — Validación y entrega de recursos.
- `assets/logo.svg` y `assets/banner.svg` — Arte y branding.
- `pitch/PayLink-pitch.pptx` — Presentación para jurado.

---

## 📚 Documentación y recursos

- [Docs Monad MiniApps](https://miniapps.farcaster.xyz/)
- [Docs Monad](https://docs.monad.xyz/)
- [Farcaster Frames](https://warpcast.notion.site/Frames-Developer-Docs-2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b)
- [PayLink Pitch Deck](pitch/PayLink-pitch.pptx)

---

## 🛠️ Personaliza tu PayLink

- Cambia el arte en `/assets`
- Edita los textos y precios en el backend
- Agrega nuevos tipos de recursos (NFT, PDF, etc)

---

## 🏆 Pitch corto

> “PayLink convierte cualquier cast en un checkout. Recibe pagos instantáneos en Monad y entrega contenido digital sin salir de Farcaster. Así de simple.”

---

## 📝 Licencia

MIT

---

¿Dudas o sugerencias?  
Abre un issue o contacta al equipo
