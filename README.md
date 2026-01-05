
# Kota Delivery Website (4 Pages)

A simple, fast static website for a kasi **kota** shop with:
- Home
- Menu
- Order (WhatsApp click-to-chat with geolocation)
- Track (request live location via WhatsApp + ETA estimate)

## 1) Edit your details
Open `assets/config.js` and change:
- `WHATSAPP_NUMBER` to your business number (international format, e.g. `27721234567`).
- `SHOP_NAME`, `SHOP_ADDRESS`.
- `SHOP_COORDS` to your GPS coordinates.
- `DELIVERY_RADIUS_KM` if you want to change 10km.

## 2) Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `kota-delivery`).
2. Upload all files from this folder to the repo root.
3. On GitHub → **Settings** → **Pages** → Source: `Deploy from a branch`, Branch: `main`, `/ (root)`.
4. Wait ~1 minute; your site will be live at `https://<your-username>.github.io/kota-delivery/`.

## 3) WhatsApp connection
- The site uses **WhatsApp Click-to-Chat** (`https://wa.me/<number>?text=...`) to open a chat with a pre-filled order.
- For real-time tracking, reply to the customer via WhatsApp and tap **Share Live Location** (available in both WhatsApp and WhatsApp Business apps).

## Notes
- This is a static site (no backend). If you want automated order management later, you can integrate a backend or WhatsApp Business API via a provider.
- Geolocation requires the customer to allow location permissions in their browser.
- Prices in `menu.html` are placeholders—edit them to match your menu.
