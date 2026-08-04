(() => {
  "use strict";

  const API_BASE = "https://www.midu.com/gw";
  const PHONE_RE = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  const MAX_PRODUCTS = 3;

  const AREAS = [
    "北京市", "天津市", "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省",
    "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省",
    "河南省", "湖北省", "湖南省", "广东省", "深圳市", "海南省", "重庆市",
    "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省",
    "广西壮族自治区", "宁夏回族自治区", "内蒙古自治区", "西藏自治区",
    "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区", "台湾省",
  ];

  const PRODUCT_GROUPS = [
    {
      key: "search",
      label: "智能检索",
      items: [
        { label: "新浪舆情通", value: "yqt" },
        { label: "索骥", value: "mdsj" },
        { label: "城感通", value: "city" },
      ],
    },
    {
      key: "proofread",
      label: "智能校对",
      items: [
        { label: "校对通", value: "jdt" },
        { label: "新媒通", value: "um" },
        { label: "安巡通", value: "axt" },
      ],
    },
    {
      key: "office",
      label: "智能办公",
      items: [{ label: "模力通", value: "mlt" }],
    },
    {
      key: "agent",
      label: "智能体",
      items: [
        { label: "模力通智能体", value: "mltznt" },
        { label: "校对通智能体", value: "jdtznt" },
        { label: "DataQ智能体", value: "dataQ" },
      ],
    },
    {
      key: "service",
      label: "服务",
      items: [
        { label: "数据服务", value: "sjfw" },
        { label: "报告定制", value: "bgdz" },
      ],
    },
  ];

  const AGENT_VALUES = new Set(["mltznt", "jdtznt", "dataQ"]);

  const state = {
    step: 1,
    selectedProducts: [],
    companyPicked: false,
    smsCd: 0,
    smsSending: false,
    saving: false,
    searchTimer: null,
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    progressBar: $("progressBar"),
    step1Title: $("step1Title"),
    step1: $("step1"),
    step2: $("step2"),
    stepSuccess: $("stepSuccess"),
    formStep1: $("formStep1"),
    formStep2: $("formStep2"),
    companyName: $("companyName"),
    companySuggest: $("companySuggest"),
    companyError: $("companyError"),
    userName: $("userName"),
    userNameError: $("userNameError"),
    phone: $("phone"),
    phoneError: $("phoneError"),
    smsCode: $("smsCode"),
    smsBtn: $("smsBtn"),
    smsError: $("smsError"),
    department: $("department"),
    productPanel: $("productPanel"),
    productGroups: $("productGroups"),
    productSummary: $("productSummary"),
    productCount: $("productCount"),
    productError: $("productError"),
    selectedTags: $("selectedTags"),
    area: $("area"),
    areaInput: $("areaInput"),
    areaPanel: $("areaPanel"),
    areaSelect: $("areaSelect"),
    areaError: $("areaError"),
    demand: $("demand"),
    checked: $("checked"),
    agreeError: $("agreeError"),
    nextBtn: $("nextBtn"),
    backBtn: $("backBtn"),
    submitBtn: $("submitBtn"),
    toast: $("toast"),
  };

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      els.toast.hidden = true;
    }, 2600);
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function setStep(step) {
    state.step = step;
    const isSuccess = step === "success";
    els.step1.hidden = step !== 1;
    els.step2.hidden = step !== 2;
    els.stepSuccess.hidden = !isSuccess;
    els.progressBar.hidden = isSuccess;
    if (els.step1Title) els.step1Title.hidden = step !== 1;

    els.progressBar.querySelectorAll(".progress-seg").forEach((seg) => {
      const n = Number(seg.dataset.step);
      seg.classList.toggle("active", !isSuccess && n === step);
      seg.classList.toggle("done", !isSuccess && n < step);
    });
  }

  function showError(el, msg) {
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function wrapOf(input) {
    return input.closest(".input-wrap");
  }

  function setWrapState(input, stateName) {
    const wrap = wrapOf(input);
    if (!wrap) return;
    wrap.classList.toggle("is-ok", stateName === "ok");
    wrap.classList.toggle("is-error", stateName === "error");
  }

  function isPhoneValid(value) {
    return /^\d{11}$/.test(value) && PHONE_RE.test(value);
  }

  function validatePhoneLive() {
    const value = els.phone.value.trim();
    els.phone.value = value.replace(/\D/g, "").slice(0, 11);

    if (!els.phone.value) {
      setWrapState(els.phone, "");
      showError(els.phoneError, "");
      return false;
    }

    if (els.phone.value.length < 11) {
      setWrapState(els.phone, "error");
      showError(els.phoneError, "请输入11位手机号");
      return false;
    }

    if (!PHONE_RE.test(els.phone.value)) {
      setWrapState(els.phone, "error");
      showError(els.phoneError, "手机号格式不正确");
      return false;
    }

    setWrapState(els.phone, "");
    showError(els.phoneError, "");
    return true;
  }

  function validateStep1() {
    let ok = true;
    const company = els.companyName.value.trim();
    const userName = els.userName.value.trim();
    const sms = els.smsCode.value.trim();

    if (!company) {
      showError(els.companyError, "单位名称不能为空");
      setWrapState(els.companyName, "error");
      ok = false;
    } else {
      showError(els.companyError, "");
      setWrapState(els.companyName, "");
    }

    if (!userName) {
      showError(els.userNameError, "请输入联系人");
      setWrapState(els.userName, "error");
      ok = false;
    } else {
      showError(els.userNameError, "");
      setWrapState(els.userName, "");
    }

    if (!validatePhoneLive()) ok = false;

    if (!sms) {
      showError(els.smsError, "请输入验证码");
      setWrapState(els.smsCode, "error");
      ok = false;
    } else if (!/^\d{6,}$/.test(sms)) {
      showError(els.smsError, "验证码格式不正确");
      setWrapState(els.smsCode, "error");
      ok = false;
    } else {
      showError(els.smsError, "");
      setWrapState(els.smsCode, "");
    }

    return ok;
  }

  function validateStep2() {
    let ok = true;
    if (!state.selectedProducts.length) {
      showError(els.productError, "请选择您想要体验的产品");
      ok = false;
    } else {
      showError(els.productError, "");
    }

    if (!els.area.value) {
      showError(els.areaError, "请选择地区");
      els.areaSelect.classList.add("is-error");
      ok = false;
    } else {
      showError(els.areaError, "");
      els.areaSelect.classList.remove("is-error");
    }

    if (!els.checked.checked) {
      showError(els.agreeError, "请先阅读并同意用户协议和隐私政策");
      ok = false;
    } else {
      showError(els.agreeError, "");
    }

    return ok;
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function setAreaValue(name) {
    els.area.value = name || "";
    els.areaInput.value = name || "";
    els.areaSelect.classList.toggle("is-error", !name);
    if (name) showError(els.areaError, "");
  }

  function renderAreaPanel(keyword) {
    const kw = (keyword || "").trim();
    const list = kw ? AREAS.filter((a) => a.includes(kw)) : AREAS;
    if (!list.length) {
      els.areaPanel.innerHTML = '<li class="empty">无匹配地区</li>';
    } else {
      els.areaPanel.innerHTML = list
        .map(
          (name) =>
            `<li role="option" data-value="${escapeHtml(name)}" class="${name === els.area.value ? "selected" : ""}">${escapeHtml(name)}</li>`
        )
        .join("");
    }
    els.areaPanel.hidden = false;
  }

  function closeAreaPanel() {
    els.areaPanel.hidden = true;
    // 关闭时若输入与已选不一致，回填已选值
    if (els.area.value) {
      els.areaInput.value = els.area.value;
    } else {
      els.areaInput.value = "";
    }
  }

  function initArea() {
    setAreaValue("上海市");

    apiPost("/other/getIpAddress", {})
      .then((res) => {
        if (res && res.code === "0000" && res.data) {
          const ipArea = Array.isArray(res.data) ? res.data.join("") : String(res.data);
          const matched = AREAS.find(
            (a) => a.includes(ipArea) || ipArea.includes(a.replace(/省|市|自治区|特别行政区/g, ""))
          );
          if (matched) setAreaValue(matched);
        }
      })
      .catch(() => {});

    els.areaInput.addEventListener("focus", () => {
      renderAreaPanel(els.areaInput.value === els.area.value ? "" : els.areaInput.value);
    });

    els.areaInput.addEventListener("input", () => {
      // 正在搜索时清空已确认值，避免误提交旧地区
      if (els.areaInput.value !== els.area.value) {
        els.area.value = "";
      }
      renderAreaPanel(els.areaInput.value);
    });

    els.areaPanel.addEventListener("mousedown", (e) => {
      // 防止点击选项时 input blur 先关闭
      e.preventDefault();
    });

    els.areaPanel.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-value]");
      if (!li) return;
      e.stopPropagation();
      setAreaValue(li.dataset.value);
      els.areaPanel.hidden = true;
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".area-select")) {
        if (!els.areaPanel.hidden) closeAreaPanel();
      }
    });
  }

  function allProducts() {
    return PRODUCT_GROUPS.flatMap((g) => g.items);
  }

  function productLabel(value) {
    return allProducts().find((p) => p.value === value)?.label || value;
  }

  function renderProductGroups() {
    els.productGroups.innerHTML = PRODUCT_GROUPS.map((group) => {
      const chips = group.items
        .map((item) => {
          const selected = state.selectedProducts.includes(item.value);
          const disabled = !selected && state.selectedProducts.length >= MAX_PRODUCTS;
          return `<button type="button" class="product-chip${selected ? " selected" : ""}" data-value="${item.value}" ${disabled ? "disabled" : ""}>${item.label}</button>`;
        })
        .join("");
      return `<div class="product-group"><div class="product-group-title">${group.label}：</div><div class="product-options">${chips}</div></div>`;
    }).join("");
  }

  function updateProductUI() {
    renderProductGroups();
    const labels = state.selectedProducts.map(productLabel);
    if (labels.length) {
      els.productSummary.textContent = labels.join("、");
      els.productSummary.className = "product-summary has-value";
    } else {
      els.productSummary.textContent = "请选择您想要体验的产品";
      els.productSummary.className = "product-summary placeholder";
    }
    els.productCount.textContent = `已选 ${state.selectedProducts.length}/${MAX_PRODUCTS}`;
    els.selectedTags.innerHTML = labels
      .map(
        (label, i) =>
          `<span class="tag">${label}<button type="button" data-remove="${state.selectedProducts[i]}" aria-label="移除${label}">×</button></span>`
      )
      .join("");
  }

  function toggleProduct(value) {
    const idx = state.selectedProducts.indexOf(value);
    if (idx >= 0) {
      state.selectedProducts.splice(idx, 1);
    } else if (state.selectedProducts.length < MAX_PRODUCTS) {
      state.selectedProducts.push(value);
    } else {
      toast(`最多选择 ${MAX_PRODUCTS} 个产品`);
      return;
    }
    showError(els.productError, "");
    updateProductUI();
  }

  function preselectFromUrl() {
    const product = qs("product");
    if (!product) return;
    const values = product.split(",").filter(Boolean);
    const valid = allProducts().map((p) => p.value);
    state.selectedProducts = values.filter((v) => valid.includes(v)).slice(0, MAX_PRODUCTS);
  }

  function renderCompanySuggest(list) {
    if (!list.length) {
      els.companySuggest.hidden = true;
      els.companySuggest.innerHTML = "";
      return;
    }
    els.companySuggest.innerHTML = list
      .slice(0, 10)
      .map((name) => `<li role="option">${escapeHtml(name)}</li>`)
      .join("");
    els.companySuggest.hidden = false;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function searchCompany(keyword) {
    clearTimeout(state.searchTimer);
    if (!keyword) {
      renderCompanySuggest([]);
      return;
    }
    state.searchTimer = setTimeout(async () => {
      try {
        const res = await apiPost("/other/enterpriseSearch", { keyword });
        const list = (res && res.data) || [];
        const names = list
          .map((item) => (typeof item === "string" ? item : item.name || item.enterpriseName || item.companyName || ""))
          .filter(Boolean);
        renderCompanySuggest(names);
      } catch (e) {
        renderCompanySuggest([]);
      }
    }, 400);
  }

  function startSmsCountdown() {
    state.smsCd = 60;
    els.smsBtn.disabled = true;
    els.smsBtn.textContent = `${state.smsCd}s`;
    const timer = setInterval(() => {
      state.smsCd -= 1;
      if (state.smsCd <= 0) {
        clearInterval(timer);
        els.smsBtn.disabled = false;
        els.smsBtn.textContent = "获取验证码";
      } else {
        els.smsBtn.textContent = `${state.smsCd}s`;
      }
    }, 1000);
  }

  async function sendSms() {
    if (state.smsSending || state.smsCd > 0) return;
    if (!validatePhoneLive()) {
      toast("请先输入正确的手机号");
      return;
    }
    state.smsSending = true;
    els.smsBtn.disabled = true;
    els.smsBtn.textContent = "发送中";
    try {
      const res = await apiPost("/login/sendSms", {
        mobile: els.phone.value.trim(),
        smsType: 4,
      });
      if (res.code === "0000") {
        toast(`验证码已发送至${els.phone.value.trim()}，10分钟内有效`);
        startSmsCountdown();
      } else {
        toast(res.message || "验证码发送失败");
        els.smsBtn.disabled = false;
        els.smsBtn.textContent = "获取验证码";
      }
    } catch (e) {
      toast("请检查您的网络再试！");
      els.smsBtn.disabled = false;
      els.smsBtn.textContent = "获取验证码";
    } finally {
      state.smsSending = false;
    }
  }

  function agentDemandPrefix() {
    return state.selectedProducts
      .filter((v) => AGENT_VALUES.has(v))
      .map(productLabel)
      .filter(Boolean)
      .join(",");
  }

  async function submitForm() {
    if (state.saving) return;
    if (!validateStep2()) return;

    // 本地联调：暂不调用提交接口，直接进入成功态
    state.saving = true;
    els.submitBtn.disabled = true;
    els.submitBtn.textContent = "提交中...";

    // PC 需同步打开新页签，避免被浏览器拦截
    openConsoleIfDesktop();
    setStep("success");

    state.saving = false;
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = "立即提交";
  }

  function isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia("(max-width: 960px)").matches
    );
  }

  function openConsoleIfDesktop() {
    if (isMobileDevice()) return;
    const homeUrl = /midu\.com$/i.test(location.hostname)
      ? `${location.origin}/home`
      : "https://www.midu.com/home";

    // 新开页签，但尽量把焦点留在当前成功页
    const newTab = window.open("about:blank", "_blank");
    if (!newTab) {
      // 弹窗被拦截时静默跳过，当前页仍停在成功态
      return;
    }
    try {
      newTab.opener = null;
      newTab.location.href = homeUrl;
      newTab.blur();
    } catch (e) {
      // ignore
    }
    window.focus();
    setTimeout(() => {
      try {
        window.focus();
      } catch (e) {
        // ignore
      }
    }, 0);
  }

  function bindEvents() {
    els.companyName.addEventListener("input", () => {
      state.companyPicked = false;
      setWrapState(els.companyName, "");
      searchCompany(els.companyName.value.trim());
    });

    els.companySuggest.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      els.companyName.value = li.textContent;
      state.companyPicked = true;
      setWrapState(els.companyName, "");
      showError(els.companyError, "");
      renderCompanySuggest([]);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".company-wrap")) {
        renderCompanySuggest([]);
      }
    });

    els.phone.addEventListener("input", validatePhoneLive);
    els.smsBtn.addEventListener("click", sendSms);

    els.formStep1.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateStep1()) setStep(2);
    });

    els.backBtn.addEventListener("click", () => setStep(1));

    els.productGroups.addEventListener("click", (e) => {
      const chip = e.target.closest(".product-chip");
      if (!chip || chip.disabled) return;
      toggleProduct(chip.dataset.value);
    });

    els.selectedTags.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (!btn) return;
      toggleProduct(btn.dataset.remove);
    });

    els.formStep2.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm();
    });
  }

  function init() {
    initArea();
    preselectFromUrl();
    updateProductUI();
    bindEvents();
    setStep(1);
  }

  init();
})();
