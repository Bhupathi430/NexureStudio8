/* ==========================================================================
   NEXURE STUDIOS - Application Logic & Exact Executive Letterhead Printing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initComparisonSlider();
  initCostCalculator();
  initFAQ();
  initContactForm();
  initTermsModal();
});

/* ==========================================================================
   1. NAVBAR LOGIC
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('mobile-drawer-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE COMPARISON SLIDER
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('comparison-container');
  const afterCard = document.getElementById('comparison-after');
  const handle = document.getElementById('comparison-handle');

  if (!container || !afterCard || !handle) return;

  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    handle.style.left = `${percentage}%`;
    afterCard.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
  };

  handle.addEventListener('mousedown', () => (isDragging = true));
  window.addEventListener('mouseup', () => (isDragging = false));

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  handle.addEventListener('touchstart', () => (isDragging = true));
  window.addEventListener('touchend', () => (isDragging = false));
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX);
  });

  container.addEventListener('click', (e) => {
    if (e.target.closest('#comparison-handle')) return;
    updatePosition(e.clientX);
  });
}

/* ==========================================================================
   3. RUPEE (₹) CALCULATOR & DIRECT A4 PRINT TRIGGER
   ========================================================================== */
function initCostCalculator() {
  const scopeBtns = document.querySelectorAll('[data-calc-scope]');
  const speedBtns = document.querySelectorAll('[data-calc-speed]');
  const addonInputs = document.querySelectorAll('.calc-addon-check');

  const priceDisplay = document.getElementById('calc-price-display');
  const saveDisplay = document.getElementById('calc-save-display');
  const summaryType = document.getElementById('calc-summary-type');
  const summarySpeed = document.getElementById('calc-summary-speed');
  const summaryAddons = document.getElementById('calc-summary-addons');
  const btnBookPlan = document.getElementById('btn-book-plan');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  let state = {
    scopePrice: 29999,
    scopeName: 'Full Corporate Website',
    speedPrice: 0,
    speedName: 'Standard (14 Days)',
    addons: []
  };

  function calculate() {
    let addonsTotal = 0;
    state.addons = [];

    addonInputs.forEach(input => {
      if (input.checked) {
        const val = parseInt(input.dataset.price);
        const name = input.dataset.name;
        addonsTotal += val;
        state.addons.push({ name: name, price: val });
      }
    });

    const totalPrice = state.scopePrice + state.speedPrice + addonsTotal;
    const traditionalMarketPrice = Math.round(totalPrice * 2.8);
    const savings = traditionalMarketPrice - totalPrice;

    const formattedTotal = `₹${totalPrice.toLocaleString('en-IN')}`;
    const formattedSavings = `₹${savings.toLocaleString('en-IN')}`;

    if (priceDisplay) priceDisplay.textContent = formattedTotal;
    if (saveDisplay) saveDisplay.textContent = `⚡ Saves ~${formattedSavings} compared to traditional agencies!`;

    if (summaryType) summaryType.textContent = state.scopeName;
    if (summarySpeed) summarySpeed.textContent = state.speedName;
    if (summaryAddons) summaryAddons.textContent = state.addons.length > 0 ? state.addons.map(a => a.name).join(', ') : 'None';
  }

  scopeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scopeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.scopePrice = parseInt(btn.dataset.price);
      state.scopeName = btn.dataset.calcScope;
      calculate();
    });
  });

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.speedPrice = parseInt(btn.dataset.price);
      state.speedName = btn.dataset.calcSpeed;
      calculate();
    });
  });

  addonInputs.forEach(input => {
    input.addEventListener('change', calculate);
  });

  if (btnBookPlan) {
    btnBookPlan.addEventListener('click', () => {
      openQuotationModal(state);
    });
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      openQuotationModal(state);
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  calculate();
}

/* ==========================================================================
   4. EXACT GRAPHIC LETTERHEAD PAPER TEMPLATE FOR QUOTATION PRINTING
   ========================================================================== */
function openQuotationModal(state) {
  const backdrop = document.getElementById('pdf-modal-backdrop');
  const content = document.getElementById('pdf-modal-content');
  const closeBtn = document.getElementById('pdf-modal-close-btn');
  const printSaveBtn = document.getElementById('btn-modal-print-save');
  const sendMailBtn = document.getElementById('btn-modal-send-mail');

  if (!backdrop || !content) return;

  const quoteId = `NEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const secHash = `SEC-VERIFIED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const logoSrc = (typeof LOGO_BASE64 !== 'undefined') ? LOGO_BASE64 : 'assets/logo.png';

  let addonsTotal = 0;
  let addonRows = '';

  state.addons.forEach(a => {
    addonsTotal += a.price;
    addonRows += `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">Bespoke Add-on: ${a.name}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">₹${a.price.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  const totalPrice = state.scopePrice + state.speedPrice + addonsTotal;
  const marketPrice = Math.round(totalPrice * 2.8);
  const savings = marketPrice - totalPrice;

  // EXACT GRAPHIC EXECUTIVE LETTERHEAD PAPER LAYOUT MATCHING LETTERHEAD.HTML
  const exactLetterheadHTML = `
    <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; color: #0f172a; position: relative; box-shadow: 0 10px 30px rgba(15,23,42,0.06);">
      <!-- Top 4-Color Brand Stripe -->
      <div style="height: 7px; width: 100%; background: linear-gradient(90deg, #5061ff 0%, #5061ff 25%, #ff4b3e 25%, #ff4b3e 50%, #cbd5e1 50%, #cbd5e1 75%, #22c55e 75%, #22c55e 100%);"></div>

      <div style="padding: 24px 28px; position: relative; z-index: 2;">
        <!-- Watermark Background Logo -->
        <img src="${logoSrc}" alt="Nexure Watermark" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 440px; opacity: 0.035; pointer-events: none; z-index: 1;">

        <!-- Header Design -->
        <header style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.25rem; border-bottom: 2px solid #0f172a; margin-bottom: 1.25rem; position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="${logoSrc}" alt="Nexure Studios Logo" style="height: 48px; width: auto; background: #000000; padding: 6px 14px; border-radius: 8px; display: block;">
            <div>
              <div style="font-weight: 800; font-size: 1.4rem; color: #0f172a; letter-spacing: -0.03em; line-height: 1;">NEXURE STUDIOS</div>
              <div style="font-size: 0.725rem; font-weight: 800; color: #5061ff; letter-spacing: 0.06em; margin-top: 0.25rem; text-transform: uppercase;">WE BUILD THINGS THAT LOOK MADE, NOT GENERATED.</div>
            </div>
          </div>

          <div style="text-align: right; font-size: 0.8rem; color: #64748b; line-height: 1.5;">
            <div><strong>Web:</strong> nexurestudio.in</div>
            <div><strong>Email:</strong> nexurestudio1@gmail.com</div>
            <div><strong>Studio:</strong> Bespoke Web Engineering</div>
          </div>
        </header>

        <!-- Metadata Strip -->
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 1.25rem; padding: 0.75rem 1.15rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; border-left: 4px solid #5061ff; position: relative; z-index: 2;">
          <div><strong>Ref ID:</strong> <span style="font-weight: 800; color: #5061ff;">${quoteId}</span></div>
          <div><strong>Date:</strong> <span>${currentDate}</span></div>
          <div><strong>Document Type:</strong> <span style="color: #22c55e; font-weight: 800;">● OFFICIAL QUOTATION</span></div>
        </div>

        <!-- Subject Heading -->
        <div style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; padding-bottom: 0.4rem; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.03em; position: relative; z-index: 2;">
          SUBJECT: BESPOKE PROJECT COST ESTIMATE & SCOPE BREAKDOWN
        </div>

        <!-- Itemized Cost Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; position: relative; z-index: 2;">
          <thead>
            <tr style="background: #f8fafc; color: #0f172a; border-bottom: 2px solid #0f172a;">
              <th style="padding: 10px 12px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Selected Package Component</th>
              <th style="padding: 10px 12px; text-align: right; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Investment (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #0f172a; font-size: 0.95rem;">${state.scopeName}</strong><br>
                <span style="font-size: 0.78rem; color: #64748b;">Includes 100/100 Lighthouse performance and smooth responsive UI</span>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #0f172a;">₹${state.scopePrice.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">
                <strong style="color: #0f172a; font-size: 0.9rem;">Timeline: ${state.speedName}</strong>
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">₹${state.speedPrice.toLocaleString('en-IN')}</td>
            </tr>
            ${addonRows}
          </tbody>
        </table>

        <!-- Total Investment Box -->
        <div style="background: #ffffff; border: 2px solid #5061ff; border-radius: 10px; padding: 1.15rem 1.5rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; position: relative; z-index: 2;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Estimated Investment</div>
            <div style="font-size: 0.825rem; color: #22c55e; font-weight: 700;">⚡ Saves ~₹${savings.toLocaleString('en-IN')} vs Traditional Market Agencies</div>
          </div>
          <div style="font-size: 2rem; font-weight: 800; color: #5061ff;">₹${totalPrice.toLocaleString('en-IN')}</div>
        </div>

        <!-- Terms Governance Card -->
        <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; border-left: 4px solid #5061ff; position: relative; z-index: 2;">
          <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem; text-transform: uppercase;">🔒 Official Terms & Conditions (Nexure Studios)</div>
          <ol style="font-size: 0.75rem; color: #334155; padding-left: 1.2rem; line-height: 1.45;">
            <li>If a customer buys a website made by us, they get access to our future upcoming updates.</li>
            <li>If a user didn't pay us money for the work used, they must be punished legally.</li>
            <li>If we make any mistake in websites after saying everything is done, we will give you the whole website for free of cost.</li>
            <li>Nexure Studio websites are man made (human made), there is no AI involved.</li>
          </ol>
        </div>

        <!-- Signature & Seal Row -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between; padding-top: 1rem; border-top: 1.5px solid #cbd5e1; margin-top: 1rem; position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 50px; height: 50px; border-radius: 50%; border: 2px dashed #5061ff; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 800; color: #5061ff; text-align: center; line-height: 1.1;">NEXURE<br>SEAL<br>2026</div>
            <div>
              <div style="font-size: 0.725rem; color: #64748b; font-weight: 700;">DIGITAL SECURITY HASH</div>
              <div style="font-size: 0.78rem; color: #5061ff; font-weight: 700; margin-top: 0.15rem;">● ${secHash}</div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 0.725rem; color: #64748b; font-weight: 700; text-transform: uppercase;">CEO Authorization & Signature</div>
            <div style="font-family: 'Dancing Script', 'Brush Script MT', cursive; font-size: 2.3rem; color: #0f172a; line-height: 1; margin: 0.2rem 0;">bhupathi naidu</div>
            <div style="font-size: 0.825rem; font-weight: 800; color: #0f172a;">Bhupathi Naidu</div>
            <div style="font-size: 0.725rem; color: #64748b;">Chief Executive Officer, Nexure Studios</div>
          </div>
        </div>

        <!-- Footer Bar -->
        <footer style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.85rem; margin-top: 0.85rem; border-top: 1px solid #e2e8f0; font-size: 0.725rem; color: #64748b; position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="display: inline-flex; gap: 5px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #5061ff; display: inline-block;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ff4b3e; display: inline-block;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #cbd5e1; display: inline-block;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #22c55e; display: inline-block;"></span>
            </div>
            <span>© 2026 Nexure Studios • nexurestudio.in • All rights reserved.</span>
          </div>
          <div>Page 1 of 1</div>
        </footer>
      </div>

      <!-- Bottom 4-Color Brand Stripe -->
      <div style="height: 5px; width: 100%; background: linear-gradient(90deg, #22c55e 0%, #22c55e 25%, #cbd5e1 25%, #cbd5e1 50%, #ff4b3e 50%, #ff4b3e 75%, #5061ff 75%, #5061ff 100%);"></div>
    </div>
  `;

  content.innerHTML = exactLetterheadHTML;
  backdrop.classList.add('active');

  if (closeBtn) {
    closeBtn.onclick = () => backdrop.classList.remove('active');
  }

  // INSTANT DIRECT NATIVE PRINT TRIGGER REQUIRED BY USER
  if (printSaveBtn) {
    printSaveBtn.onclick = () => {
      window.print();
    };
  }

  if (sendMailBtn) {
    sendMailBtn.onclick = () => {
      backdrop.classList.remove('active');
      const msgArea = document.getElementById('contact-message');
      const contactSection = document.getElementById('contact');
      if (msgArea) {
        msgArea.value = `Hi Nexure Studios,\n\nI would like to book the project under Quotation Ref: ${quoteId}\n- Scope: ${state.scopeName}\n- Timeline: ${state.speedName}\n- Add-ons: ${state.addons.map(a => a.name).join(', ') || 'Standard'}\n- Total Investment: ₹${totalPrice.toLocaleString('en-IN')}\n- Security Hash: ${secHash}\n- Authorized by CEO: Bhupathi Naidu`;
      }
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
}

/* ==========================================================================
   5. INTERACTIVE TERMS & CONDITIONS MODAL
   ========================================================================== */
function initTermsModal() {
  const termsBackdrop = document.getElementById('terms-modal-backdrop');
  const termsClose = document.getElementById('terms-modal-close-btn');
  const termsAgree = document.getElementById('terms-modal-agree-btn');
  const navTerms = document.getElementById('nav-terms-btn');
  const mobileTerms = document.getElementById('mobile-terms-btn');
  const footerTerms = document.getElementById('footer-terms-btn');

  function openTerms(e) {
    if (e) e.preventDefault();
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (termsBackdrop) termsBackdrop.classList.add('active');
  }

  function closeTerms() {
    if (termsBackdrop) termsBackdrop.classList.remove('active');
  }

  if (navTerms) navTerms.addEventListener('click', openTerms);
  if (mobileTerms) mobileTerms.addEventListener('click', openTerms);
  if (footerTerms) footerTerms.addEventListener('click', openTerms);

  if (termsClose) termsClose.addEventListener('click', closeTerms);
  if (termsAgree) termsAgree.addEventListener('click', closeTerms);

  if (termsBackdrop) {
    termsBackdrop.addEventListener('click', (e) => {
      if (e.target === termsBackdrop) closeTerms();
    });
  }
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  const searchInput = document.getElementById('faq-search-input');
  const faqItems = document.querySelectorAll('.faq-item');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.faq-item');
      const isActive = parent.classList.contains('active');
      faqItems.forEach(item => item.classList.remove('active'));
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM & EMAIL COPYING (nexurestudio1@gmail.com)
   ========================================================================== */
function initContactForm() {
  const copyBtn = document.getElementById('btn-copy-email');
  const emailText = 'nexurestudio1@gmail.com';
  const form = document.getElementById('contact-form');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText).then(() => {
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
        }, 2500);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      const mailtoUrl = `mailto:nexurestudio1@gmail.com?subject=Project Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      const submitBtn = form.querySelector('.btn-submit-form');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⚡ Opening Email Client...';

      setTimeout(() => {
        window.location.href = mailtoUrl;
        submitBtn.textContent = originalText;
      }, 1000);
    });
  }
}
