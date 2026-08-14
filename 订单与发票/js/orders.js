const orders = [
  { id: "GEO202608050019", brand: "瑞幸咖啡", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-08-05 10:24", status: "completed", statusText: "已完成", amount: 299, canInvoice: true, invoiced: false, detail: "微信小程序体验套餐", questionCount: 7, models: ["DeepSeek", "豆包", "元宝"] },
  { id: "GEO202608040083", brand: "库迪咖啡", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-08-04 16:12", status: "completed", statusText: "已完成", amount: 599, canInvoice: false, invoiced: true, invoiceId: "INV202608040021", detail: "微信小程序体验套餐", questionCount: 10, models: ["DeepSeek", "豆包", "元宝", "Kimi"] },
  { id: "GEO202608030057", brand: "蜜雪冰城", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-08-03 09:35", status: "completed", statusText: "已完成", amount: 299, canInvoice: false, invoiced: true, invoiceId: "INV202608030008", detail: "微信小程序体验套餐", questionCount: 7, models: ["DeepSeek", "豆包", "千问"] },
  { id: "GEO202608020031", brand: "霸王茶姬", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-08-02 14:07", status: "pending_pay", statusText: "待支付", amount: 299, canInvoice: false, invoiced: false, detail: "微信小程序体验套餐", questionCount: 7, models: ["DeepSeek", "豆包", "元宝"] },
  { id: "GEO202607300027", brand: "茶百道", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-07-30 13:18", status: "cancelled", statusText: "已取消", amount: 199, canInvoice: false, invoiced: false, detail: "微信小程序体验套餐", questionCount: 5, models: ["DeepSeek", "豆包"] },
  { id: "GEO202607280061", brand: "海底捞", product: "品牌 AI 搜索竞争力诊断报告", date: "2026-07-28 17:40", status: "completed", statusText: "已完成", amount: 599, canInvoice: true, invoiced: false, detail: "微信小程序体验套餐", questionCount: 10, models: ["DeepSeek", "豆包", "元宝", "Kimi", "千问", "文心一言"] },
];

let records = [
  { id: "INV202608040021", status: "processing", statusText: "开票中", date: "2026-08-04 18:20", amount: 599, count: 1, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "lizemingsh@midu.com", emailStatus: "待发送", invoiceNo: "—", orderIds: ["GEO202608040083"] },
  { id: "INV202608030008", status: "issued", statusText: "开票完成", date: "2026-08-03 11:26", amount: 299, count: 1, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "lizemingsh@midu.com", emailStatus: "已发送", invoiceNo: "2026080300010872", orderIds: ["GEO202608030057"] },
  { id: "INV202607260014", status: "failed", statusText: "开票失败", date: "2026-07-26 18:05", amount: 598, count: 2, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "orma***@midu.com", emailStatus: "发送失败", invoiceNo: "—", orderIds: [] },
];

const state = {
  module: "orders",
  orderFilter: "all",
  invoiceView: "eligible",
  recordFilter: "all",
  selected: new Set(),
  currentOrder: null,
  currentRecord: null,
};

function $(id) {
  return document.getElementById(id);
}

function statusClass(s) {
  if (s === "completed" || s === "done" || s === "issued") return "done";
  if (s === "pending_pay") return "wait";
  if (s === "pending_use" || s === "running" || s === "processing") return "running";
  if (s === "failed") return "failed";
  return "cancel";
}

function orderTitle(o) {
  const p = o.product || "";
  if (p.startsWith("品牌")) return (o.brand || "") + p.slice(2);
  return p.replace("品牌", o.brand || "");
}

function findInvoiceForOrder(order) {
  if (!order) return null;
  if (order.invoiceId) {
    const byId = records.find((r) => r.id === order.invoiceId);
    if (byId) return byId;
  }
  return records.find((r) => Array.isArray(r.orderIds) && r.orderIds.includes(order.id)) || null;
}

function invoicePhase(o) {
  const rec = findInvoiceForOrder(o);
  if (rec) return rec.status;
  if (o.invoiced) return "issued";
  return "none";
}

function eligibleOrders() {
  return orders.filter(
    (o) => o.canInvoice && !o.invoiced && o.status === "completed" && invoicePhase(o) === "none"
  );
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

function money(n) {
  return Number(n).toFixed(2);
}

function updateStats() {
  const counts = {
    all: orders.length,
    pending_pay: orders.filter((o) => o.status === "pending_pay").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };
  $("countAll").textContent = counts.all;
  $("countPay").textContent = counts.pending_pay;
  $("countDone").textContent = counts.completed;
  $("countCancel").textContent = counts.cancelled;
  $("countEligible").textContent = eligibleOrders().length;
  $("navOrderBadge").textContent = counts.all;
  $("navInvoiceBadge").textContent = eligibleOrders().length;
}

function orderActions(o) {
  if (o.status === "pending_pay") {
    return `<button class="btn-danger" data-cancel="${o.id}">取消订单</button><button class="btn-primary" data-pay="${o.id}">去支付</button>`;
  }
  const phase = invoicePhase(o);
  if (phase === "processing") {
    return `<button class="btn-ghost" data-detail="${o.id}">订单详情</button><button class="btn-primary" disabled>开票中</button>`;
  }
  if (phase === "issued") {
    return `<button class="btn-ghost" data-detail="${o.id}">订单详情</button><button class="btn-primary" data-view-invoice="${o.id}">查看发票</button>`;
  }
  if (o.status === "cancelled" || phase === "failed" || !o.canInvoice || o.invoiced) {
    return `<button class="btn-ghost" data-detail="${o.id}">订单详情</button>`;
  }
  return `<button class="btn-ghost" data-detail="${o.id}">订单详情</button><button class="btn-primary" data-invoice="${o.id}">开发票</button>`;
}

function renderOrders() {
  const data = orders.filter((o) => state.orderFilter === "all" || o.status === state.orderFilter);
  const list = $("orderList");
  list.innerHTML = data.length
    ? data
        .map(
          (o) => `
      <tr class="order-card" data-order-id="${o.id}">
        <td>
          <span class="cell-title">${orderTitle(o)}</span>
          <span class="cell-meta">${o.detail} · ${o.questionCount} 个问题</span>
        </td>
        <td>
          <span class="cell-title">${o.id}</span>
          <span class="cell-meta">${o.date}<br>${o.models.join("、")}</span>
        </td>
        <td class="amount">¥${money(o.amount)}</td>
        <td><span class="status ${statusClass(o.status)}">${o.statusText}</span></td>
        <td><div class="ops">${orderActions(o)}</div></td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="5" class="empty">暂无相关订单</td></tr>`;
}

function renderEligible() {
  const data = eligibleOrders();
  state.selected = new Set([...state.selected].filter((id) => data.some((o) => o.id === id)));
  const list = $("eligibleList");
  list.innerHTML = data.length
    ? data
        .map(
          (o) => `
      <tr class="${state.selected.has(o.id) ? "row-selected" : ""}" data-select="${o.id}">
        <td class="select-cell"><span class="check"></span></td>
        <td><span class="cell-title">${orderTitle(o)}</span><span class="cell-meta">${o.detail}</span></td>
        <td><span class="cell-title">${o.id}</span><span class="cell-meta">${o.date}</span></td>
        <td class="amount">¥${money(o.amount)}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4" class="empty">当前没有可开票的已完成订单</td></tr>`;
  updateSelection();
}

function updateSelection() {
  const selected = eligibleOrders().filter((o) => state.selected.has(o.id));
  const total = selected.reduce((s, o) => s + o.amount, 0);
  $("selectedCount").textContent = selected.length;
  $("selectedTotal").textContent = money(total);
  $("formTotal").textContent = money(total);
  $("goInvoice").disabled = !selected.length;
  $("selectAll").classList.toggle("on", dataAllSelected());
}

function dataAllSelected() {
  const data = eligibleOrders();
  return data.length > 0 && data.every((o) => state.selected.has(o.id));
}

function recordMonth(date) {
  const [y, m] = date.slice(0, 7).split("-");
  return `${y}年${m}月`;
}

function renderRecords() {
  const data = records.filter((r) => state.recordFilter === "all" || r.status === state.recordFilter);
  const list = $("recordList");
  if (!data.length) {
    list.innerHTML = `<tr><td colspan="5" class="empty">暂无相关开票记录</td></tr>`;
    return;
  }
  list.innerHTML = data
    .map(
      (r) => `
      <tr>
        <td>
          <span class="cell-title">品牌 AI 搜索竞争力诊断报告</span>
          <span class="cell-meta">${r.id} · ${r.count > 1 ? `共 ${r.count} 笔订单` : r.company}</span>
        </td>
        <td class="cell-meta">${r.date}</td>
        <td class="amount">¥${money(r.amount)}</td>
        <td><span class="status ${statusClass(r.status)}">${r.statusText}</span></td>
        <td><div class="ops">${
          r.status === "issued"
            ? `<button class="btn-ghost" data-resend="${r.id}">重新发送</button><button class="btn-ghost" data-reopen="${r.id}">申请重开</button>`
            : r.status === "failed"
            ? `<button class="btn-danger" data-retry="${r.id}">重新申请</button>`
            : `<button class="btn-ghost" data-record-detail="${r.id}">查看进度</button>`
        }</div></td>
      </tr>`
    )
    .join("");
}

function setModule(module) {
  state.module = module;
  $("ordersModule").classList.toggle("hidden", module !== "orders");
  $("invoiceModule").classList.toggle("hidden", module !== "invoice");
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === module);
  });
}

function setInvoiceView(view) {
  state.invoiceView = view;
  $("eligibleView").classList.toggle("hidden", view !== "eligible");
  $("recordsView").classList.toggle("hidden", view !== "records");
  document.querySelectorAll("[data-invoice-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.invoiceView === view);
  });
}

function closeOverlays() {
  $("drawerMask").hidden = true;
  $("orderDrawer").hidden = true;
  $("invoiceDrawer").hidden = true;
  $("invoiceFormModal").hidden = true;
  $("confirmModal").hidden = true;
}

function openOrderDetail(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  state.currentOrder = o;
  $("orderDrawerBody").innerHTML = `
    <section class="detail-hero">
      <span class="status ${statusClass(o.status)}">${o.statusText}</span>
      <div class="amount-big">¥${money(o.amount)}</div>
      <p>${orderTitle(o)}</p>
    </section>
    <div class="section-title">订单信息</div>
    <section class="info-card">
      <div class="info-row"><span>订单号</span><b>${o.id}</b></div>
      <div class="info-row"><span>套餐</span><b>${o.detail}</b></div>
      <div class="info-row"><span>问题数量</span><b>${o.questionCount} 个</b></div>
      <div class="info-row"><span>采样模型</span><b>${o.models.join("、")}</b></div>
      <div class="info-row"><span>下单时间</span><b>${o.date}</b></div>
      <div class="info-row"><span>支付金额</span><b>¥${money(o.amount)}</b></div>
    </section>
  `;
  $("orderDrawerFoot").innerHTML = orderActions(o);
  $("drawerMask").hidden = false;
  $("orderDrawer").hidden = false;
  $("invoiceDrawer").hidden = true;
}

function mailState(r) {
  if (r.emailStatus === "已发送") return { text: "已发送", cls: "done" };
  if (r.emailStatus === "发送失败") return { text: "发送失败", cls: "failed" };
  return { text: "待发送", cls: "running" };
}

function openInvoiceDetail(id) {
  const r = records.find((x) => x.id === id);
  if (!r) return;
  state.currentRecord = r;
  const mail = mailState(r);
  $("invoiceDrawerBody").innerHTML = `
    <section class="detail-hero">
      <span class="status ${statusClass(r.status)}">${r.statusText}</span>
      <div class="amount-big">¥${money(r.amount)}</div>
      <p>${r.content}</p>
    </section>
    <div class="section-title">发票信息</div>
    <section class="info-card">
      <div class="info-row"><span>发票编号</span><b>${r.invoiceNo}</b></div>
      <div class="info-row"><span>企业名称</span><b>${r.company}</b></div>
      <div class="info-row"><span>公司税号</span><b>${r.tax}</b></div>
      <div class="info-row"><span>发票格式</span><b>PDF</b></div>
      <div class="info-row"><span>申请时间</span><b>${r.date}</b></div>
    </section>
    <div class="section-title">接收方式</div>
    <section class="info-card">
      <div class="info-row"><span>电子邮箱</span><b>${r.email}</b></div>
      <div class="info-row"><span>发送状态</span><span class="status ${mail.cls}">${mail.text}</span></div>
    </section>
  `;
  $("invoiceDrawerFoot").innerHTML =
    r.status === "issued"
      ? `<button class="btn-ghost" data-resend="${r.id}">重新发送</button><button class="btn-primary" data-reopen="${r.id}">申请重开</button>`
      : r.status === "failed"
      ? `<button class="btn-primary" data-retry="${r.id}">重新申请</button>`
      : `<button class="btn-ghost" data-close-drawer>关闭</button>`;
  $("drawerMask").hidden = false;
  $("invoiceDrawer").hidden = false;
  $("orderDrawer").hidden = true;
}

function startInvoice(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  const phase = invoicePhase(o);
  if (phase === "processing") return toast("该订单正在开票中");
  if (phase === "issued") return openInvoiceDetail(findInvoiceForOrder(o).id);
  if (o.status === "pending_pay") return toast("订单支付完成后可申请开票");
  if (o.status === "cancelled") return toast("已取消订单无法申请开票");
  if (phase === "failed" || !o.canInvoice || o.invoiced) return toast("当前订单不可申请开票");
  state.selected = new Set([id]);
  openInvoiceForm();
}

function openInvoiceForm() {
  const selected = eligibleOrders().filter((o) => state.selected.has(o.id));
  if (!selected.length) return toast("请先选择可开票订单");
  updateSelection();
  closeOverlays();
  $("invoiceFormModal").hidden = false;
}

function payOrder(id) {
  const o = orders.find((x) => x.id === id);
  if (!o || o.status !== "pending_pay") return;
  o.status = "completed";
  o.statusText = "已完成";
  o.canInvoice = true;
  toast("支付成功，可申请开票");
  refresh();
  if (!$("orderDrawer").hidden && state.currentOrder && state.currentOrder.id === id) openOrderDetail(id);
}

function cancelOrder(id) {
  const o = orders.find((x) => x.id === id);
  if (!o || o.status !== "pending_pay") return;
  o.status = "cancelled";
  o.statusText = "已取消";
  o.canInvoice = false;
  toast("订单已取消");
  refresh();
  if (!$("orderDrawer").hidden && state.currentOrder && state.currentOrder.id === id) openOrderDetail(id);
}

function submitInvoice() {
  const company = $("companyName").value.trim();
  const tax = $("taxNo").value.trim();
  const email = $("invoiceEmail").value.trim();
  if (!company) return toast("请填写公司名称");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("请输入正确的电子邮箱");
  const selected = eligibleOrders().filter((o) => state.selected.has(o.id));
  const total = selected.reduce((s, o) => s + o.amount, 0);
  $("confirmBody").innerHTML = `
    <div class="info-row"><span>企业名称</span><b>${company}</b></div>
    <div class="info-row"><span>公司税号</span><b>${tax || "—"}</b></div>
    <div class="info-row"><span>发票内容</span><b>*信息技术服务*平台服务费</b></div>
    <div class="info-row"><span>发票金额</span><b>¥${money(total)}</b></div>
    <div class="info-row"><span>电子邮箱</span><b>${email}</b></div>
  `;
  $("confirmModal").hidden = false;
}

function finishSubmit() {
  const selected = eligibleOrders().filter((o) => state.selected.has(o.id));
  const total = selected.reduce((s, o) => s + o.amount, 0);
  const rec = {
    id: "INV" + Date.now().toString().slice(-12),
    status: "processing",
    statusText: "开票中",
    date: "2026-08-14 14:30",
    amount: total,
    count: selected.length,
    company: $("companyName").value.trim(),
    tax: $("taxNo").value.trim(),
    content: "*信息技术服务*平台服务费",
    email: $("invoiceEmail").value.trim(),
    emailStatus: "待发送",
    invoiceNo: "—",
    orderIds: selected.map((s) => s.id),
  };
  records.unshift(rec);
  selected.forEach((s) => {
    s.invoiced = true;
    s.canInvoice = false;
    s.invoiceId = rec.id;
  });
  state.selected = new Set();
  closeOverlays();
  setModule("invoice");
  setInvoiceView("records");
  state.recordFilter = "all";
  document.querySelectorAll("[data-record-filter]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.recordFilter === "all");
  });
  refresh();
  toast("开票申请已提交，完成后将发送至邮箱");
}

function refresh() {
  updateStats();
  renderOrders();
  renderEligible();
  renderRecords();
}

function onClick(e) {
  const t = e.target.closest("[data-module],[data-order-filter],[data-invoice-view],[data-record-filter],[data-detail],[data-pay],[data-cancel],[data-invoice],[data-view-invoice],[data-select],[data-record-detail],[data-resend],[data-reopen],[data-retry],[data-close-drawer],[data-close-modal]");
  if (!t) return;

  if (t.dataset.module) setModule(t.dataset.module);
  if (t.dataset.orderFilter) {
    state.orderFilter = t.dataset.orderFilter;
    document.querySelectorAll("[data-order-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.orderFilter === state.orderFilter);
    });
    renderOrders();
  }
  if (t.dataset.invoiceView) setInvoiceView(t.dataset.invoiceView);
  if (t.dataset.recordFilter) {
    state.recordFilter = t.dataset.recordFilter;
    document.querySelectorAll("[data-record-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.recordFilter === state.recordFilter);
    });
    renderRecords();
  }
  if (t.dataset.detail) openOrderDetail(t.dataset.detail);
  if (t.dataset.pay) payOrder(t.dataset.pay);
  if (t.dataset.cancel) cancelOrder(t.dataset.cancel);
  if (t.dataset.invoice) startInvoice(t.dataset.invoice);
  if (t.dataset.viewInvoice) {
    const rec = findInvoiceForOrder(orders.find((o) => o.id === t.dataset.viewInvoice));
    if (rec) openInvoiceDetail(rec.id);
    else toast("未找到对应发票");
  }
  if (t.dataset.select) {
    const id = t.dataset.select;
    if (state.selected.has(id)) state.selected.delete(id);
    else state.selected.add(id);
    renderEligible();
  }
  if (t.dataset.recordDetail) openInvoiceDetail(t.dataset.recordDetail);
  if (t.dataset.resend) {
    const rec = records.find((r) => r.id === t.dataset.resend);
    if (rec) {
      rec.emailStatus = "已发送";
      toast("电子发票已重新发送至邮箱");
      refresh();
      if (!$("invoiceDrawer").hidden) openInvoiceDetail(rec.id);
    }
  }
  if (t.dataset.reopen) {
    const rec = records.find((r) => r.id === t.dataset.reopen);
    if (rec) {
      rec.status = "processing";
      rec.statusText = "开票中";
      rec.emailStatus = "待发送";
      toast("已提交重开申请");
      refresh();
      if (!$("invoiceDrawer").hidden) openInvoiceDetail(rec.id);
    }
  }
  if (t.dataset.retry) {
    setInvoiceView("eligible");
    closeOverlays();
    setModule("invoice");
    toast("请重新选择可开票订单");
  }
  if (t.hasAttribute("data-close-drawer") || t.id === "drawerMask") closeOverlays();
  if (t.hasAttribute("data-close-modal")) {
    if (t.closest("#confirmModal")) $("confirmModal").hidden = true;
    else closeOverlays();
  }
}

document.addEventListener("click", (e) => {
  if (e.target.id === "drawerMask") closeOverlays();
  else onClick(e);
});

$("selectAll").addEventListener("click", () => {
  const data = eligibleOrders();
  if (dataAllSelected()) state.selected = new Set();
  else state.selected = new Set(data.map((o) => o.id));
  renderEligible();
});

$("goInvoice").addEventListener("click", openInvoiceForm);
$("submitInvoice").addEventListener("click", submitInvoice);
$("confirmSubmit").addEventListener("click", finishSubmit);

document.addEventListener("click", (e) => {
  const card = e.target.closest(".order-card");
  if (card && !e.target.closest("button")) openOrderDetail(card.dataset.orderId);
});

refresh();
