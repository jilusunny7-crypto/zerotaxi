// Zero Taxi - Interactive Website Logic & WhatsApp Booking Engine

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Active Booking Tab Logic
  const tabButtons = document.querySelectorAll('.tab-btn');
  const bookingTypeInput = document.getElementById('tripType');
  const destinationLabel = document.getElementById('destinationLabel');
  const destinationInput = document.getElementById('destinationInput');
  const pickupLabel = document.getElementById('pickupLabel');
  const pickupInput = document.getElementById('pickupInput');

  const tabPlaceholders = {
    'Outstation & One-Way': {
      pickup: 'e.g. Ernakulam / Kochi, Thrissur',
      drop: 'e.g. Munnar, Alleppey, Calicut, Bangalore',
      dropLabel: 'Drop-off Destination'
    },
    'Airport Transfer': {
      pickup: 'e.g. Cochin Airport (COK), Trivandrum (TRV), Calicut (CCJ)',
      drop: 'e.g. Hotel / City / Home Address',
      dropLabel: 'Drop-off Address / Hotel'
    },
    'Kerala Tour Package': {
      pickup: 'e.g. Kochi Airport / Railway Station',
      drop: 'e.g. Munnar - Thekkady - Alleppey (4D/3N)',
      dropLabel: 'Select / Enter Package'
    },
    'Railway Pickup': {
      pickup: 'e.g. Ernakulam Junction (South) / Town (North), Aluva',
      drop: 'e.g. Hotel, Home, or Resort Destination',
      dropLabel: 'Destination Address'
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tripType = btn.getAttribute('data-trip-type');
      if (bookingTypeInput) bookingTypeInput.value = tripType;

      if (tabPlaceholders[tripType]) {
        if (pickupLabel) pickupLabel.innerText = tripType === 'Airport Transfer' ? 'Pickup Airport / Location' : 'Pickup City / Point';
        if (pickupInput) pickupInput.placeholder = tabPlaceholders[tripType].pickup;
        if (destinationLabel) destinationLabel.innerText = tabPlaceholders[tripType].dropLabel;
        if (destinationInput) destinationInput.placeholder = tabPlaceholders[tripType].drop;
      }
    });
  });

  // Service Dropdown Sync Logic (For all 9 services)
  const serviceDropdown = document.getElementById('serviceSelectDropdown');
  if (serviceDropdown) {
    serviceDropdown.addEventListener('change', () => {
      const val = serviceDropdown.value;
      if (bookingTypeInput) bookingTypeInput.value = val;

      if (val === 'Airport Transfers') {
        const tab = document.querySelector('[data-trip-type="Airport Transfer"]');
        if (tab) tab.click();
      } else if (val === 'Railway Station Pickup') {
        const tab = document.querySelector('[data-trip-type="Railway Pickup"]');
        if (tab) tab.click();
      } else if (val === 'Kerala Tour Packages') {
        const tab = document.querySelector('[data-trip-type="Kerala Tour Package"]');
        if (tab) tab.click();
      } else {
        const tab = document.querySelector('[data-trip-type="Outstation & One-Way"]');
        if (tab) tab.click();
      }
    });
  }

  // Vehicle Selection Details updater
  const vehicleSelect = document.getElementById('vehicleSelect');
  const vehicleBadge = document.getElementById('vehicleBadge');
  
  const vehicleFeatures = {
    'Innova Crysta': '★ Premium White Innova Crysta | Dual AC | Extra Luggage Room',
    'Executive Sedan': '★ 4 Passengers | Comfortable AC Sedan (Dzire / Etios) | Economical',
    'Family MPV (Ertiga)': '★ 6-Seater AC | Ideal for Small Families & City Outstation',
    'Luxury Tempo Traveller': '★ 12 to 26 Seater | Pushback Recliners | Group & Pilgrimage Tours'
  };

  if (vehicleSelect && vehicleBadge) {
    vehicleSelect.addEventListener('change', () => {
      const selected = vehicleSelect.value;
      vehicleBadge.innerText = vehicleFeatures[selected] || 'Clean, sanitized vehicle with professional chauffeur';
    });
  }

  // Booking Form Submission to WhatsApp
  const bookingForm = document.getElementById('quickBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const tripType = document.getElementById('tripType')?.value || 'Tour / Taxi Booking';
      const pickup = document.getElementById('pickupInput')?.value.trim() || 'Not specified';
      const drop = document.getElementById('destinationInput')?.value.trim() || 'Not specified';
      const date = document.getElementById('pickupDate')?.value || 'Flexible';
      const time = document.getElementById('pickupTime')?.value || 'Flexible';
      const vehicle = document.getElementById('vehicleSelect')?.value || 'Toyota Innova Crysta';
      const passengers = document.getElementById('passengerCount')?.value || '1-4';
      const name = document.getElementById('custName')?.value.trim() || 'Customer';
      const phone = document.getElementById('custPhone')?.value.trim() || '';
      const notes = document.getElementById('custNotes')?.value.trim();

      // Selected WhatsApp contact
      const contactSelect = document.getElementById('whatsappNumberSelect')?.value || '919605913120';

      let message = `🚕 *NEW TAXI BOOKING INQUIRY - ZERO TAXI*\n`;
      message += `------------------------------------\n`;
      message += `📍 *Service / Trip:* ${tripType}\n`;
      message += `🚗 *Vehicle:* ${vehicle}\n`;
      message += `🚩 *Pickup:* ${pickup}\n`;
      message += `🎯 *Drop / Destination:* ${drop}\n`;
      message += `📅 *Date:* ${date}\n`;
      message += `⏰ *Time:* ${time}\n`;
      message += `👥 *Passengers:* ${passengers} Persons\n`;
      message += `👤 *Customer Name:* ${name}\n`;
      if (phone) message += `📞 *Contact No:* ${phone}\n`;
      if (notes) message += `📝 *Notes:* ${notes}\n`;
      message += `------------------------------------\n`;
      message += `_Sent via Zero Taxi Website (Ride Zero. Worry Zero.)_`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${contactSelect}?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // Quick Route Selector in Route Calculator
  const routeSelect = document.getElementById('popularRouteSelect');
  const routeDistance = document.getElementById('routeDistance');
  const routeDuration = document.getElementById('routeDuration');
  const routeBestCab = document.getElementById('routeBestCab');
  const routeBookBtn = document.getElementById('routeBookBtn');

  const routeData = {
    'cok-munnar': {
      from: 'Cochin Airport (COK)',
      to: 'Munnar Hill Station',
      dist: '110 km',
      time: '3.5 - 4 Hours',
      cab: 'Toyota Innova Crysta / Sedan',
      scenic: 'Enroute Cheeyappara & Valara Waterfalls'
    },
    'cok-alleppey': {
      from: 'Cochin Airport (COK)',
      to: 'Alleppey (Alappuzha) Houseboats',
      dist: '85 km',
      time: '2 - 2.5 Hours',
      cab: 'Innova Crysta / Swift Dzire',
      scenic: 'Coastal backwaters & village scenery'
    },
    'kochi-thekkady': {
      from: 'Kochi / Ernakulam',
      to: 'Thekkady (Periyar Wildlife Sanctuary)',
      dist: '155 km',
      time: '4.5 Hours',
      cab: 'Toyota Innova Crysta',
      scenic: 'Spice plantations & Western Ghats views'
    },
    'kochi-wayanad': {
      from: 'Kochi / Calicut',
      to: 'Wayanad Hill Station',
      dist: '250 km (from Kochi) / 85 km (from CCJ)',
      time: '6.5 Hours (from Kochi)',
      cab: 'Innova Crysta / SUV',
      scenic: 'Thamarassery Ghat pass, misty peaks'
    },
    'kochi-sabarimala': {
      from: 'Kochi / Kottayam',
      to: 'Sabarimala (Pamba Base Camp)',
      dist: '210 km',
      time: '5 - 5.5 Hours',
      cab: 'Innova Crysta / Tempo Traveller',
      scenic: 'Pilgrimage route with 24/7 dedicated driver'
    },
    'kochi-guruvayur': {
      from: 'Kochi / Airport',
      to: 'Guruvayur Sri Krishna Temple',
      dist: '95 km',
      time: '2.5 Hours',
      cab: 'Innova Crysta / Sedan',
      scenic: 'Expressway & temple heritage route'
    }
  };

  if (routeSelect) {
    routeSelect.addEventListener('change', () => {
      const selected = routeData[routeSelect.value];
      if (selected) {
        if (routeDistance) routeDistance.innerText = selected.dist;
        if (routeDuration) routeDuration.innerText = selected.time;
        if (routeBestCab) routeBestCab.innerText = `${selected.cab} (${selected.scenic})`;
      }
    });

    if (routeBookBtn) {
      routeBookBtn.addEventListener('click', () => {
        const selectedKey = routeSelect.value;
        const selected = routeData[selectedKey];
        if (selected) {
          // Pre-fill booking form
          if (pickupInput) pickupInput.value = selected.from;
          if (destinationInput) destinationInput.value = selected.to;
          if (vehicleSelect && selected.cab.includes('Innova')) vehicleSelect.value = 'Innova Crysta';
          
          // Scroll to form
          const bookingSection = document.getElementById('booking');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }

  // Quick package book handler
  window.selectPackage = function(packageName, suggestedVehicle) {
    const tourTab = document.querySelector('[data-trip-type="Kerala Tour Package"]');
    if (tourTab) tourTab.click();
    
    if (destinationInput) destinationInput.value = packageName;
    if (pickupInput && !pickupInput.value) pickupInput.value = 'Cochin Airport / Railway Station';
    if (vehicleSelect && suggestedVehicle) vehicleSelect.value = suggestedVehicle;

    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick Service Selector handler (Supports all 9 services from the flyer)
  window.selectService = function(serviceTitle, defaultPickup, defaultDrop, preferredVehicle) {
    let tabName = 'Kerala Tour Package';
    if (serviceTitle.includes('Airport')) tabName = 'Airport Transfer';
    else if (serviceTitle.includes('Railway')) tabName = 'Railway Pickup';
    else if (serviceTitle.includes('Outstation') || serviceTitle.includes('South India') || serviceTitle.includes('One Day')) tabName = 'Outstation & One-Way';

    const matchingTab = document.querySelector(`[data-trip-type="${tabName}"]`);
    if (matchingTab) matchingTab.click();

    if (bookingTypeInput) bookingTypeInput.value = serviceTitle;
    if (serviceDropdown) {
      for (let i = 0; i < serviceDropdown.options.length; i++) {
        if (serviceDropdown.options[i].value === serviceTitle) {
          serviceDropdown.selectedIndex = i;
          break;
        }
      }
    }
    if (destinationInput) destinationInput.value = defaultDrop || serviceTitle;
    if (pickupInput && (!pickupInput.value || pickupInput.value.includes('e.g.'))) {
      pickupInput.value = defaultPickup || 'Kochi / Ernakulam';
    }
    if (vehicleSelect && preferredVehicle) {
      vehicleSelect.value = preferredVehicle;
      vehicleSelect.dispatchEvent(new Event('change'));
    }

    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
});
