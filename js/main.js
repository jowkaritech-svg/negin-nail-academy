const STORAGE_KEY = "nnc_lang";
const CHAT_SOUND_KEY = "nnc_chat_muted";
const BOOKING_URL = "https://www.fresha.com/a/negin-nail-center-north-vancouver-2030-marine-drive-brt5d7tx/all-offer?menu=true&share=true&pId=934444";
const MAPS_URL = "https://maps.google.com/?q=2030+Marine+Drive,+North+Vancouver";
const PHONE_NUMBER = "+1 (778) 586-7100";
const PHONE_HREF = "tel:+17785867100";
const EMAIL = "neginnailacademy@gmail.com";
const EMAIL_HREF = "mailto:neginnailacademy@gmail.com";
const GMAIL_COMPOSE_URL = "https://mail.google.com/mail/?view=cm&fs=1";
const OUTLOOK_COMPOSE_URL = "https://outlook.office.com/mail/deeplink/compose";

let currentLang = "en";

document.addEventListener("DOMContentLoaded", () => {
  setupHeaderScroll();
  setupMobileNav();
  setupSectionNav();
  setupLanguageSystem();
  setupRevealAnimations();
  setupGalleryLightbox();
  setupContactForm();
  setupChatbot();
  setYear();
  handleHashOnLoad();
});

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!document.body.classList.contains("nav-open")) return;
    if (target.closest(".site-nav") || target.closest(".nav-toggle")) return;
    close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) close();
  });
}

function setupSectionNav() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      smoothScrollTo(target);
      history.replaceState(null, "", targetId);
    });
  });

  const updateActive = () => {
    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 84;
    const marker = window.scrollY + headerHeight + 80;
    let currentId = sections[0]?.id || "home";

    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
}

function setupLanguageSystem() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const modal = document.getElementById("language-modal");
  const pickerButtons = document.querySelectorAll("[data-lang-choice]");
  const toggleButtons = document.querySelectorAll("[data-lang-set]");

  if (saved === "en" || saved === "fa") {
    setLanguage(saved, { save: false });
  } else {
    setLanguage("en", { save: false });
    openLanguageModal(modal);
  }

  pickerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.getAttribute("data-lang-choice") || "en");
      closeLanguageModal(modal);
    });
  });

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.getAttribute("data-lang-set") || "en");
    });
  });
}

function openLanguageModal(modal) {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLanguageModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setLanguage(lang, options = { save: true }) {
  currentLang = lang === "fa" ? "fa" : "en";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";

  if (options.save !== false) localStorage.setItem(STORAGE_KEY, currentLang);

  document.querySelectorAll("[data-lang-set]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-lang-set") === currentLang);
  });

  window.dispatchEvent(new CustomEvent("languagechange", { detail: currentLang }));
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function setupGalleryLightbox() {
  const lightbox = document.getElementById("lightbox");
  const items = document.querySelectorAll(".lightbox-item");
  const image = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  const close = lightbox?.querySelector(".lightbox-close");
  if (!lightbox || !items.length || !image || !caption || !close) return;

  const open = (src, captionEn, captionFa) => {
    image.src = src;
    caption.textContent = currentLang === "fa" ? captionFa || captionEn || "" : captionEn || captionFa || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-image") || item.querySelector("img")?.src || "";
      if (!src) return;
      open(src, item.getAttribute("data-caption-en"), item.getAttribute("data-caption-fa"));
    });
  });

  close.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = form?.querySelector(".form-status");
  const topic = document.getElementById("topic");
  const submit = document.getElementById("contact-submit");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  if (!form || !status || !topic || !submit) return;

  const setStatus = (message, isError = false) => {
    status.classList.toggle("is-error", isError);
    status.innerHTML = message;
  };

  const getSubmitLabel = (opening = false) => {
    if (currentLang === "fa") {
      return opening
        ? '<span class="lang-fa">در حال باز کردن پیش نویس...</span>'
        : '<span class="lang-en">Open Email Draft</span><span class="lang-fa">باز کردن پیش نویس ایمیل</span>';
    }

    return opening
      ? '<span class="lang-en">Opening draft...</span>'
      : '<span class="lang-en">Open Email Draft</span><span class="lang-fa">باز کردن پیش نویس ایمیل</span>';
  };

  const buildDraftLinks = (payload) => {
    const selectedTopic = topic.options[topic.selectedIndex]?.text || payload.topic || "General Inquiry";
    const subject = currentLang === "fa"
      ? `پیام وب سایت - ${selectedTopic}`
      : `Website Inquiry - ${selectedTopic}`;

    const body = (currentLang === "fa"
      ? [
          "سلام نگین نیل آکادمی،",
          "",
          "من از طریق وب سایت پیام می دهم.",
          "",
          `نام: ${payload.name}`,
          `ایمیل: ${payload.email}`,
          `شماره تماس: ${payload.phone || "ثبت نشده"}`,
          `موضوع: ${selectedTopic}`,
          "",
          "پیام:",
          payload.message,
          "",
          "با تشکر"
        ]
      : [
          "Hello Negin Nail Academy,",
          "",
          "I am reaching out through the website.",
          "",
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Phone: ${payload.phone || "Not provided"}`,
          `Topic: ${selectedTopic}`,
          "",
          "Message:",
          payload.message,
          "",
          "Thank you"
        ]).join("\n");

    const encodedTo = encodeURIComponent(EMAIL);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    return {
      gmail: `${GMAIL_COMPOSE_URL}&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`,
      outlook: `${OUTLOOK_COMPOSE_URL}?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`,
      mailto: `${EMAIL_HREF}?subject=${encodedSubject}&body=${encodedBody}`
    };
  };

  const updateTopicLabels = () => {
    if (topic.options.length < 4) return;
    if (currentLang === "fa") {
      topic.options[0].text = "انتخاب کنید";
      topic.options[1].text = "سوال درباره رزرو";
      topic.options[2].text = "جزئیات خدمات";
      topic.options[3].text = "تغییر نوبت";
    } else {
      topic.options[0].text = "Select";
      topic.options[1].text = "Booking Question";
      topic.options[2].text = "Service Details";
      topic.options[3].text = "Appointment Change";
    }
  };

  const updatePlaceholders = () => {
    if (nameInput) nameInput.placeholder = currentLang === "fa" ? "نام شما" : "Your name";
    if (emailInput) emailInput.placeholder = currentLang === "fa" ? "example@email.com" : "you@example.com";
    if (phoneInput) phoneInput.placeholder = currentLang === "fa" ? "0912 000 0000 یا (778) 000-0000" : "(778) 000-0000";
    if (messageInput) messageInput.placeholder = currentLang === "fa" ? "بگویید چطور می توانیم کمکتان کنیم" : "Tell us how we can help";
  };

  const setSubmitting = (submitting) => {
    submit.disabled = submitting;
    submit.style.opacity = submitting ? "0.8" : "1";
    submit.innerHTML = getSubmitLabel(submitting);
  };

  updateTopicLabels();
  updatePlaceholders();
  window.addEventListener("languagechange", () => {
    updateTopicLabels();
    updatePlaceholders();
    setSubmitting(false);
    if (!status.textContent.trim()) return;
    setStatus("");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("");

    if (!form.reportValidity()) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    const draftLinks = buildDraftLinks(payload);

    setSubmitting(true);

    const gmailWindow = window.open(draftLinks.gmail, "_blank", "noopener");

    if (!gmailWindow) {
      window.location.href = draftLinks.mailto;
    }

    setStatus(
      currentLang === "fa"
        ? `پیش نویس ایمیل آماده شد. اگر Gmail باز نشد، از یکی از گزینه های زیر استفاده کنید.<span class="mail-link-group"><a class="mail-client-btn" href="${draftLinks.gmail}" target="_blank" rel="noopener">Gmail</a><a class="mail-client-btn" href="${draftLinks.outlook}" target="_blank" rel="noopener">Outlook</a><a class="mail-client-btn" href="${draftLinks.mailto}">Mail App</a></span>`
        : `Your email draft is ready. If Gmail did not open, use one of these options.<span class="mail-link-group"><a class="mail-client-btn" href="${draftLinks.gmail}" target="_blank" rel="noopener">Gmail</a><a class="mail-client-btn" href="${draftLinks.outlook}" target="_blank" rel="noopener">Outlook</a><a class="mail-client-btn" href="${draftLinks.mailto}">Mail App</a></span>`
    );

    setSubmitting(false);
  });
}

function handleHashOnLoad() {
  const hash = window.location.hash.replace("#", "").trim();
  if (!hash) return;

  window.setTimeout(() => {
    const target = document.getElementById(hash);
    if (!target) return;
    smoothScrollTo(target);
    highlightTarget(target);
  }, 120);
}

function smoothScrollTo(target) {
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 84;
  const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function highlightTarget(target) {
  target.classList.add("section-highlight");
  window.setTimeout(() => target.classList.remove("section-highlight"), 2200);
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  smoothScrollTo(target);
  history.replaceState(null, "", `#${sectionId}`);
  highlightTarget(target);
}

function setupChatbot() {
  const toggle = document.getElementById("chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const closeBtn = document.getElementById("chatbot-close");
  const soundBtn = document.getElementById("chatbot-sound");
  const messages = document.getElementById("chatbot-messages");
  const suggestionsRoot = document.getElementById("chatbot-suggestions");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const triggerButtons = document.querySelectorAll("[data-open-chatbot]");
  if (!toggle || !panel || !closeBtn || !soundBtn || !messages || !suggestionsRoot || !form || !input) return;

  const badge = document.createElement("span");
  badge.className = "chatbot-badge";
  badge.textContent = "1";
  badge.setAttribute("aria-hidden", "true");
  toggle.appendChild(badge);

  let muted = localStorage.getItem(CHAT_SOUND_KEY) === "true";
  let isOpen = false;
  let unread = false;
  let started = false;
  let lastActionAt = Date.now();
  let reminderTimer = 0;

  soundBtn.setAttribute("data-muted", String(muted));

  const baseSuggestions = {
    en: ["Book now", "Where are you located?", "Show gallery", "How can I contact you?"],
    fa: ["رزرو نوبت", "آدرس شما کجاست؟", "گالری را نشان بده", "چطور تماس بگیرم؟"]
  };

  function playTone(kind = "message") {
    if (muted) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const sequences = {
      open: [720, 860],
      message: [640],
      reminder: [640, 720]
    };

    (sequences[kind] || sequences.message).forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + index * 0.08;
      const end = start + 0.07;

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.0001;

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.018, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.start(start);
      oscillator.stop(end + 0.01);
    });
  }

  function markUnread(value) {
    unread = value;
    badge.classList.toggle("visible", unread);
    toggle.classList.toggle("has-alert", unread);
  }

  function updateInputCopy() {
    input.placeholder = currentLang === "fa" ? "سوال خود را بنویسید..." : "Ask a question...";
  }

  function addMessage(type, text, html = false) {
    const bubble = document.createElement("div");
    bubble.className = `chat-msg ${type}`;
    if (html) bubble.innerHTML = text;
    else bubble.textContent = text;

    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;

    if (type === "bot") {
      playTone("message");
      if (!isOpen) markUnread(true);
    }
  }

  function addTypingThenMessage(text, html = false, delay = 420) {
    const typing = document.createElement("div");
    typing.className = "chat-msg bot";
    typing.innerHTML = '<span class="chat-typing"><span></span><span></span><span></span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      addMessage("bot", text, html);
    }, delay);
  }

  function setSuggestions(list) {
    suggestionsRoot.innerHTML = "";
    list.forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-suggestion";
      button.textContent = label;
      button.addEventListener("click", () => {
        input.value = label;
        handleUserMessage(label);
      });
      suggestionsRoot.appendChild(button);
    });
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    markUnread(false);
    playTone("open");
    if (!started) {
      started = true;
      startConversation();
    }
    input.focus();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  }

  function getChatReply(rawText) {
    const text = rawText.trim();
    const normalized = text.toLowerCase();

    const has = (patterns) => patterns.some((pattern) => pattern.test(normalized));

    if (!text) {
      return {
        text: currentLang === "fa" ? "سوال خود را بنویسید تا کمکتان کنم." : "Type your question and I will help you.",
        suggestions: baseSuggestions[currentLang]
      };
    }

    if (has([/^(hi|hello|hey|salam|سلام)/, /(good morning|good evening)/])) {
      return {
        text: currentLang === "fa"
          ? "سلام، خوش آمدید. می توانم در مورد رزرو، آدرس، گالری یا راه های تماس کمکتان کنم."
          : "Hi there, welcome. I can help with booking, location, the gallery, or contact details.",
        suggestions: baseSuggestions[currentLang]
      };
    }

    if (has([/book/, /booking/, /appointment/, /reserve/, /fresha/, /رزرو/, /نوبت/])) {
      return {
        text: currentLang === "fa"
          ? `حتما. برای رزرو مستقیم از این لینک استفاده کنید: <a class="chat-link" href="${BOOKING_URL}" target="_blank" rel="noopener">رزرو نوبت</a>`
          : `Sure. You can book directly here: <a class="chat-link" href="${BOOKING_URL}" target="_blank" rel="noopener">Book now</a>`,
        html: true,
        suggestions: currentLang === "fa"
          ? ["آدرس شما کجاست؟", "گالری را نشان بده", "چطور تماس بگیرم؟"]
          : ["Where are you located?", "Show gallery", "How can I contact you?"]
      };
    }

    if (has([/gallery/, /photo/, /photos/, /work/, /نمونه/, /گالری/, /عکس/])) {
      return {
        text: currentLang === "fa"
          ? "شما را به بخش گالری می برم تا نمونه ها را ببینید."
          : "I will take you to the gallery section so you can see the visual samples.",
        action: () => scrollToSection("gallery"),
        suggestions: currentLang === "fa"
          ? ["رزرو نوبت", "آدرس شما کجاست؟"]
          : ["Book now", "Where are you located?"]
      };
    }

    if (has([/about/, /owner/, /who are you/, /studio/, /درباره/, /مالک/, /صاحب/])) {
      return {
        text: currentLang === "fa"
          ? "شما را به بخش درباره ما هدایت می کنم. آنجا می توانید عکس صاحب مجموعه را هم بعدا اضافه کنید."
          : "I will take you to the About section. You can also add the owner's photo there later.",
        action: () => scrollToSection("about"),
        suggestions: currentLang === "fa"
          ? ["رزرو نوبت", "گالری را نشان بده"]
          : ["Book now", "Show gallery"]
      };
    }

    if (has([/address/, /location/, /map/, /where/, /direction/, /آدرس/, /لوکیشن/, /موقعیت/, /نقشه/])) {
      return {
        text: currentLang === "fa"
          ? `آدرس مجموعه: 2030 Marine Drive, North Vancouver<br><a class="chat-link" href="${MAPS_URL}" target="_blank" rel="noopener">باز کردن نقشه</a>`
          : `The studio is located at 2030 Marine Drive, North Vancouver.<br><a class="chat-link" href="${MAPS_URL}" target="_blank" rel="noopener">Open map</a>`,
        html: true,
        suggestions: currentLang === "fa"
          ? ["رزرو نوبت", "چطور تماس بگیرم؟"]
          : ["Book now", "How can I contact you?"]
      };
    }

    if (has([/call/, /phone/, /email/, /contact/, /message/, /تماس/, /تلفن/, /ایمیل/, /پیام/])) {
      return {
        text: currentLang === "fa"
          ? `می توانید با شماره <a class="chat-link" href="${PHONE_HREF}">${PHONE_NUMBER}</a> تماس بگیرید یا به <a class="chat-link" href="${EMAIL_HREF}">${EMAIL}</a> ایمیل بزنید.`
          : `You can call <a class="chat-link" href="${PHONE_HREF}">${PHONE_NUMBER}</a> or email <a class="chat-link" href="${EMAIL_HREF}">${EMAIL}</a>.`,
        html: true,
        action: () => scrollToSection("contact"),
        suggestions: currentLang === "fa"
          ? ["رزرو نوبت", "آدرس شما کجاست؟"]
          : ["Book now", "Where are you located?"]
      };
    }

    if (has([/thank/, /thanks/, /مرسی/, /ممنون/])) {
      return {
        text: currentLang === "fa" ? "خواهش می کنم. اگر خواستید برای رزرو یا اطلاعات بیشتر هم کمکتان می کنم." : "You're welcome. I can also help if you want to book or need more information.",
        suggestions: baseSuggestions[currentLang]
      };
    }

    return {
      text: currentLang === "fa"
        ? "می توانم برای رزرو نوبت، پیدا کردن آدرس، نمایش گالری یا راه های تماس کمکتان کنم. یکی از پیشنهادها را امتحان کنید."
        : "I can help you with booking, the studio address, the gallery, or contact details. Try one of the suggestions below.",
      suggestions: baseSuggestions[currentLang]
    };
  }

  function handleUserMessage(text) {
    const message = text.trim();
    if (!message) return;

    lastActionAt = Date.now();
    addMessage("user", message);
    input.value = "";

    const reply = getChatReply(message);
    addTypingThenMessage(reply.text, !!reply.html);

    if (typeof reply.action === "function") {
      window.setTimeout(() => reply.action(), 260);
    }

    setSuggestions(reply.suggestions || baseSuggestions[currentLang]);
  }

  function startConversation() {
    messages.innerHTML = "";
    addMessage(
      "bot",
      currentLang === "fa"
        ? "سلام، من دستیار نگین هستم. هر سوالی درباره رزرو، آدرس، گالری یا تماس دارید بپرسید."
        : "Hello, I am Negin Assistant. Ask me anything about booking, the address, the gallery, or how to contact the studio."
    );
    setSuggestions(baseSuggestions[currentLang]);
    updateInputCopy();
  }

  function startReminder() {
    reminderTimer = window.setInterval(() => {
      const idleMs = Date.now() - lastActionAt;
      if (isOpen || idleMs < 45000) return;
      if (!unread) {
        markUnread(true);
        playTone("reminder");
      }
    }, 15000);
  }

  toggle.addEventListener("click", () => {
    lastActionAt = Date.now();
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener("click", () => {
    lastActionAt = Date.now();
    closePanel();
  });

  soundBtn.addEventListener("click", () => {
    muted = !muted;
    soundBtn.setAttribute("data-muted", String(muted));
    localStorage.setItem(CHAT_SOUND_KEY, String(muted));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleUserMessage(input.value);
  });

  triggerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      lastActionAt = Date.now();
      openPanel();
    });
  });

  window.addEventListener("languagechange", () => {
    updateInputCopy();
    if (!started) return;
    startConversation();
  });

  updateInputCopy();
  startReminder();
  window.addEventListener("beforeunload", () => window.clearInterval(reminderTimer));
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}
