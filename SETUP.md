# ATELIER — Ultra-Premium 3D Custom Clothing Platform

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Install Dependencies

```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 2. Configure Environment

The server `.env` is already pre-configured for local development:
- MongoDB: `mongodb://localhost:27017/atelier-clothing`
- Port: `5000`

Edit `server/.env` to change settings.

### 3. Seed the Database

```bash
cd server
npm run seed
```

Default accounts created:
| Role       | Email                    | Password       |
|------------|--------------------------|----------------|
| Admin      | admin@atelier.com        | Admin@1234     |
| Customer   | customer@atelier.com     | Customer@1234  |
| Production | production@atelier.com   | Prod@12345     |

### 4. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

Open: http://localhost:5173

---

## Platform Structure

```
CustomClothing-Platform/
├── client/                    # React + Vite + TypeScript frontend
│   └── src/
│       ├── components/
│       │   ├── 3d/           # Three.js / React Three Fiber
│       │   │   ├── GarmentModel.tsx    # 3D garment mesh
│       │   │   └── Scene.tsx           # R3F canvas, lighting, controls
│       │   ├── designer/     # 3D Studio UI panels
│       │   │   ├── LeftPanel.tsx       # Garment, colors, fabric, patterns, size
│       │   │   ├── RightPanel.tsx      # Price summary + cart
│       │   │   ├── BottomToolbar.tsx   # Camera views, undo/redo
│       │   │   └── DecalEditor.tsx     # Text & image decals
│       │   └── storefront/   # Navbar, CartDrawer
│       ├── pages/
│       │   ├── HomePage.tsx            # Premium landing page
│       │   ├── DesignerPage.tsx        # Full-screen 3D studio
│       │   ├── LoginPage.tsx           # Auth
│       │   ├── CheckoutPage.tsx        # 3-step checkout
│       │   ├── OrdersPage.tsx          # Order tracking
│       │   └── AdminPage.tsx           # Admin dashboard
│       ├── store/            # Zustand stores
│       │   ├── designStore.ts          # Design state (colors, fabric, decals)
│       │   ├── authStore.ts            # Auth + user
│       │   └── cartStore.ts            # Cart
│       └── utils/
│           ├── designData.ts           # Colors, fabrics, patterns, sizes
│           └── pricing.ts              # Price calculation (client-side preview)
└── server/                    # Node.js + Express + MongoDB backend
    └── src/
        ├── models/            # User, Order
        ├── routes/            # auth, orders, admin
        ├── middleware/        # JWT auth, admin guard
        └── utils/seed.js      # Database seeder
```

## Key Features

### 3D Studio
- Real-time 3D garment preview (React Three Fiber)
- Zone-based color system (body, collar, cuffs, sleeves, buttons, pockets, stitching)
- Fabric type selection with PBR material properties
- Text & image decals with zone placement
- Undo/redo history
- Camera views: front, back, left, right
- Auto-rotation with orbit controls

### E-Commerce
- Full auth (register/login/JWT)
- Cart with quantity management
- Server-side price recalculation (no price injection)
- 3-step checkout (review → address → payment)
- Order tracking with status progression

### Admin Dashboard
- Stats overview (revenue, orders, users, pending)
- Order management with status updates
- User management
- Platform settings

## Adding Real 3D Models (GLB/GLTF)

The current GarmentModel uses Three.js primitives as a development stand-in.
To use real Blender/professional GLB models:

1. Place `.glb` files in `client/public/models/`
2. Load them in `GarmentModel.tsx` using `useGLTF` from `@react-three/drei`
3. Access mesh nodes and apply material overrides per zone

```tsx
import { useGLTF } from '@react-three/drei'

const { nodes, materials } = useGLTF('/models/tshirt.glb')
// Apply zone colors to specific mesh nodes
```

## Upgrade Path

- **Payment**: Integrate Razorpay or Stripe (`/api/orders/create-payment`)
- **Image upload**: Add Cloudinary/S3 for decal image storage
- **Real GLB models**: Source from TurboSquid, CGTrader, or Blender-made
- **Email notifications**: Add Nodemailer templates in server
- **Tamil language**: Add i18n with `react-i18next`
