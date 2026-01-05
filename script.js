
function kmBetween(p1, p2) {
  const R = 6371; // Earth radius in km
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(p1.lat * Math.PI/180) * Math.cos(p2.lat * Math.PI/180) * Math.sin(dLng/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function mapsDirectionsURL(origin, destination) {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
}

function openWhatsAppWithText(text) {
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${0728259322}?text=${encoded}`;
  window.open(url, '_blank');
}

// Build order message from form
function buildOrderMessage(formData, userCoords) {
  const items = formData.getAll('item');
  const qtys = formData.getAll('qty');
  const lines = [];
  for (let i=0;i<items.length;i++) {
    if (qtys[i] && Number(qtys[i])>0) lines.push(`- ${items[i]} x${qtys[i]}`);
  }
  const extras = formData.getAll('extra');
  const extrasList = extras.length ? `\nExtras: ${extras.join(', ')}` : '';
  const name = formData.get('name') || '';
  const phone = formData.get('phone') || '';
  const address = formData.get('address') || '';
  const notes = formData.get('notes') || '';
  let locText = '';
  if (userCoords) {
    const d = kmBetween(SHOP_COORDS, userCoords).toFixed(1);
    const etaMins = Math.round((d / AVG_SPEED_KMH) * 60) + 10; // +10 for prep time
    const gmaps = mapsDirectionsURL(SHOP_COORDS, userCoords);
    locText = `\nLocation: lat ${userCoords.lat.toFixed(5)}, lng ${userCoords.lng.toFixed(5)} (≈${d} km from shop)\nDirections: ${gmaps}\nEstimated delivery: ${etaMins} minutes`;
  }
  const msg = `*${Mxo_Kota} Order*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nOrder:\n${lines.join('\n')}${extrasList}\nNotes: ${notes}${locText}\n\nPlease confirm availability & price.`;
  return msg;
}

// On order page
async function handleOrderSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  let coords = null;
  if (fd.get('useLocation') === 'on') {
    try { coords = await getUserLocation(); }
    catch (err) { alert('Could not get your location. You can still order without it.'); }
  }
  const distanceOK = !coords || kmBetween(SHOP_COORDS, coords) <= DELIVERY_RADIUS_KM + 0.5;
  if (!distanceOK) {
    alert(`Sorry, you are outside our ${DELIVERY_RADIUS_KM}km delivery radius.`);
    return;
  }
  const msg = buildOrderMessage(fd, coords);
  openWhatsAppWithText(msg);
}

// Track page helper
async function showMyDistance() {
  const el = document.getElementById('distance');
  try {
    const me = await getUserLocation();
    const d = kmBetween(SHOP_COORDS, me).toFixed(1);
    const etaMins = Math.round((d / AVG_SPEED_KMH) * 60) + 10;
    const link = mapsDirectionsURL(SHOP_COORDS, me);
    el.innerHTML = `You are ≈ <b>${d} km</b> from ${SHOP_NAME}. Estimated delivery if you order now: <b>${etaMins} minutes</b>.<br><a class="btn btn-primary" href="${link}" target="_blank">View directions</a>`;
  } catch (err) {
    el.textContent = 'Allow location to see your distance & ETA.';
  }
}
