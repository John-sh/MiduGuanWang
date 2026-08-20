const orders = [
  { id: "MD202608150019", product: "新浪舆情通", version: "旗舰版", benefit: ["全网监测周期 12 个月，覆盖新闻、微博、微信、短视频、论坛等主流信源", "账号席位 10 个，支持按角色分配查看、研判、导出权限", "热点事件预警 200 条/日，支持关键词、地域、情感多维规则", "报告导出：日报 / 周报 / 专题报告，支持 Word、PDF", "历史数据回溯 3 年，含传播路径与重点账号分析"], price: 98000, qty: 1, amount: 98000, date: "2026-08-15 10:24", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608140083", product: "索骥", version: "专业版", benefit: ["线索监测周期 6 个月，覆盖公开网络与指定站点", "预警额度 50 条/日，支持优先级分级推送", "线索库容量 10 万条，支持标签、去重与合并研判", "导出权限：Excel / CSV，含原文链接与传播摘要"], price: 36000, qty: 1, amount: 36000, date: "2026-08-14 16:12", status: "completed", statusText: "已完成", canInvoice: false, invoiced: true, invoiceId: "INV202608140021" },
  { id: "MD202608130057", product: "城感通", version: "标准版", benefit: ["城市感知监测 12 个月，覆盖市政、交通、民生等主题", "账号席位 5 个，支持按区域查看", "事件工单联动 1000 次/月", "区域热力图与趋势看板，支持周报自动生成"], price: 28000, qty: 1, amount: 28000, date: "2026-08-13 09:35", status: "completed", statusText: "已完成", canInvoice: false, invoiced: true, invoiceId: "INV202608130008" },
  { id: "MD202608120031", product: "校对通", version: "企业版", benefit: ["智能校对额度 10 万字/月，有效期 12 个月", "支持公文、新闻、宣传稿等多文体校对", "错敏词库可定制，含行业词、领导人姓名、地名", "校对记录留存 180 天，支持对照导出"], price: 12800, qty: 1, amount: 12800, date: "2026-08-12 14:07", status: "pending_pay", statusText: "待支付", canInvoice: false, invoiced: false },
  { id: "MD202608110027", product: "新媒通", version: "专业版", benefit: ["新媒体运营周期 12 个月", "账号席位 5 个，覆盖微博、微信、抖音等内容发布", "素材库 5000 条，支持选题日历与审核流", "传播效果复盘周报自动生成"], price: 19800, qty: 1, amount: 19800, date: "2026-08-11 13:18", status: "cancelled", statusText: "已取消", canInvoice: false, invoiced: false },
  { id: "MD202608100061", product: "安巡通", version: "旗舰版", benefit: ["安全巡检周期 12 个月", "巡检站点 20 个，含可用性、篡改、挂马监测", "告警通道：短信 / 邮件 / 企微，响应时效 5 分钟", "巡检报告按日归档，支持整改闭环记录"], price: 56000, qty: 1, amount: 56000, date: "2026-08-10 17:40", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608090044", product: "模力通", version: "标准版", benefit: ["模型调用额度 100 万 tokens，有效期 12 个月", "支持主流大模型切换与提示词模板", "并发 10 路，日志留存 90 天", "用量看板与超限预警"], price: 8800, qty: 2, amount: 17600, date: "2026-08-09 11:05", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608080072", product: "模力通智能体", version: "专业版", benefit: ["智能体席位 3 个，有效期 12 个月", "支持知识库挂载 5 个，单库 2GB", "对话记录留存 180 天，可导出", "权限：创建、发布、分享至内部成员"], price: 25800, qty: 1, amount: 25800, date: "2026-08-08 15:22", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608070018", product: "校对通智能体", version: "标准版", benefit: ["校对智能体 1 席，有效期 12 个月", "支持长文分段校对与修改建议对照", "词库同步企业版校对通", "会话记录留存 90 天"], price: 9800, qty: 1, amount: 9800, date: "2026-08-07 09:48", status: "completed", statusText: "已完成", canInvoice: false, invoiced: true, invoiceId: "INV202608070014" },
  { id: "MD202608060053", product: "DataQ智能体", version: "企业版", benefit: ["数据问答席位 5 个，有效期 12 个月", "可连接业务数据源 3 个，支持权限隔离", "问数结果可导出图表与明细表", "问答审计日志留存 1 年"], price: 39800, qty: 1, amount: 39800, date: "2026-08-06 18:16", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608050036", product: "数据服务", version: "定制包", benefit: ["专项数据采集与清洗 1 次", "交付字段按需求清单约定，含去重、标准化、质检报告", "交付周期 15 个工作日，支持一次修订", "成果物：数据包 + 数据字典 + 质检说明"], price: 48000, qty: 1, amount: 48000, date: "2026-08-05 16:40", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
  { id: "MD202608040012", product: "报告定制", version: "专题报告", benefit: ["行业分析报告定制 1 份", "含现状、竞品、传播与建议四部分，约 30 页", "提供 1 次大纲确认与 1 次成稿修订", "交付格式：PPT + PDF，含数据附件"], price: 26800, qty: 1, amount: 26800, date: "2026-08-04 10:18", status: "completed", statusText: "已完成", canInvoice: true, invoiced: false },
];

let records = [
  { id: "INV202608140021", status: "processing", statusText: "开票中", date: "2026-08-14 18:20", amount: 36000, count: 1, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "lizemingsh@midu.com", emailStatus: "待发送", invoiceNo: "—", orderIds: ["MD202608140083"] },
  { id: "INV202608130008", status: "issued", statusText: "已开票", date: "2026-08-13 11:26", amount: 28000, count: 1, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "lizemingsh@midu.com", emailStatus: "已发送", invoiceNo: "2026081300010872", orderIds: ["MD202608130057"] },
  { id: "INV202608070014", status: "failed", statusText: "开票失败", date: "2026-08-07 18:05", amount: 9800, count: 1, company: "上海蜜度云科技有限公司", tax: "91310115MA1K4GEO88", content: "*信息技术服务*平台服务费", email: "orma***@midu.com", emailStatus: "发送失败", invoiceNo: "—", orderIds: ["MD202608070018"] },
];

const PAGE_SIZE = 10;

const state = {
  module: "orders",
  orderFilter: "all",
  orderPage: 1,
  invoiceView: "eligible",
  recordFilter: "all",
  selected: new Set(),
  currentOrder: null,
  currentRecord: null,
};

const entity = {
  confirmed: false,
  type: "enterprise",
  company: "",
  tax: "",
  bank: "",
  account: "",
  address: "",
  phone: "",
  email: "",
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

function recordProducts(r) {
  const related = orders.filter((o) => Array.isArray(r.orderIds) && r.orderIds.includes(o.id));
  if (!related.length) return r.content || "信息技术服务";
  return related.map((o) => o.product).join("、");
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

function drawerActions(o) {
  return orderActions(o).replace(/<button class="btn-ghost" data-detail="[^"]+">订单详情<\/button>/g, "").trim();
}

function filteredOrders() {
  return orders.filter((o) => state.orderFilter === "all" || o.status === state.orderFilter);
}

function orderPageCount() {
  return Math.max(1, Math.ceil(filteredOrders().length / PAGE_SIZE) || 1);
}

function pagerNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  let start = Math.max(2, current - 2);
  let end = Math.min(total - 1, current + 2);
  if (current <= 4) {
    start = 2;
    end = 5;
  } else if (current >= total - 3) {
    start = total - 4;
    end = total - 1;
  }
  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

function setOrderPage(page) {
  const total = orderPageCount();
  state.orderPage = Math.min(total, Math.max(1, Number(page) || 1));
  renderOrders();
}

function jumpOrderPage() {
  const total = orderPageCount();
  const n = parseInt($("orderPageJump").value, 10);
  if (!Number.isFinite(n) || n < 1 || n > total) return toast("请输入有效页码");
  $("orderPageJump").value = "";
  setOrderPage(n);
}

function renderOrderPager() {
  const totalItems = filteredOrders().length;
  const total = orderPageCount();
  if (state.orderPage > total) state.orderPage = total;
  const current = state.orderPage;
  const nums = totalItems ? pagerNumbers(current, total) : [1];
  const prevDisabled = current <= 1;
  const nextDisabled = current >= total || !totalItems;
  $("orderPagerPages").innerHTML = `
    <button type="button" class="pager-btn" data-order-page="prev" ${prevDisabled ? "disabled" : ""} aria-label="上一页">&lt;</button>
    ${nums
      .map((n) =>
        n === "ellipsis"
          ? `<span class="pager-ellipsis">...</span>`
          : `<button type="button" class="pager-btn${n === current ? " active" : ""}" data-order-page="${n}">${n}</button>`
      )
      .join("")}
    <button type="button" class="pager-btn" data-order-page="next" ${nextDisabled ? "disabled" : ""} aria-label="下一页">&gt;</button>
  `;
}

function renderOrders() {
  const data = filteredOrders();
  const total = Math.max(1, Math.ceil(data.length / PAGE_SIZE) || 1);
  if (state.orderPage > total) state.orderPage = total;
  const pageData = data.slice((state.orderPage - 1) * PAGE_SIZE, state.orderPage * PAGE_SIZE);
  const list = $("orderList");
  list.innerHTML = pageData.length
    ? pageData
        .map(
          (o) => `
      <tr class="order-card" data-order-id="${o.id}">
        <td class="num-cell">${o.id}</td>
        <td><span class="cell-title">${o.product}</span></td>
        <td class="amount">¥${money(o.amount)}</td>
        <td><span class="status ${statusClass(o.status)}">${o.statusText}</span></td>
        <td><div class="ops">${orderActions(o)}</div></td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="5" class="empty">暂无相关订单</td></tr>`;
  renderOrderPager();
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
        <td class="num-cell">${o.id}</td>
        <td><span class="cell-title">${o.product}</span></td>
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
          <span class="cell-title">${recordProducts(r)}</span>
          <span class="cell-meta">${r.id} · ${r.count > 1 ? `共 ${r.count} 笔订单` : r.company}</span>
        </td>
        <td class="cell-meta">${r.date}</td>
        <td class="amount">¥${money(r.amount)}</td>
        <td><span class="status ${statusClass(r.status)}">${r.statusText}</span></td>
        <td><div class="ops">${
          r.status === "issued"
            ? `<button class="btn-ghost" data-resend="${r.id}">重新发送</button>`
            : r.status === "failed"
            ? `<button class="btn-danger" data-retry="${r.id}">重新申请</button>`
            : ""
        }</div></td>
      </tr>`
    )
    .join("");
}

function setModule(module) {
  state.module = module;
  $("entityModule").classList.toggle("hidden", module !== "entity");
  $("ordersModule").classList.toggle("hidden", module !== "orders");
  $("invoiceModule").classList.toggle("hidden", module !== "invoice");
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === module);
  });
}

function syncEntityStatus() {
  const tag = $("entityStatusTag");
  const nav = $("navEntityStatus");
  if (entity.confirmed) {
    tag.textContent = "已确认";
    tag.className = "status done";
    nav.textContent = "已确认";
    nav.className = "nav-status done";
    $("confirmEntity").textContent = "保存并确认";
  } else {
    tag.textContent = "未确认";
    tag.className = "status wait";
    nav.textContent = "未确认";
    nav.className = "nav-status wait";
    $("confirmEntity").textContent = "确认开票主体";
  }
}

function readEntityForm() {
  const typeEl = document.querySelector('input[name="entityType"]:checked');
  const type = typeEl ? typeEl.value : "enterprise";
  const enterprise = isEnterprise(type);
  return {
    type,
    company: $("entityCompany").value.trim(),
    tax: enterprise ? $("entityTax").value.trim().toUpperCase() : "",
    bank: $("entityBank").value.trim(),
    account: $("entityAccount").value.trim(),
    address: $("entityAddress").value.trim(),
    phone: $("entityPhone").value.trim(),
    email: $("entityEmail").value.trim(),
  };
}

function isEnterprise(type) {
  return (type || entity.type) === "enterprise";
}

function syncEntityTypeUI() {
  const enterprise = isEnterprise(readEntityForm().type);
  $("entityCompanyLabel").innerHTML = enterprise ? "公司名称 <i>*</i>" : "发票抬头 <i>*</i>";
  $("entityCompany").placeholder = enterprise ? "请输入营业执照上的公司全称" : "请输入发票抬头";
  $("entityTaxRow").classList.toggle("hidden", !enterprise);
  if (!enterprise) $("entityTax").value = "";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function confirmEntity() {
  const data = readEntityForm();
  if (!data.company) return toast(isEnterprise(data.type) ? "请填写公司名称" : "请填写发票抬头");
  if (isEnterprise(data.type) && !/^[A-Z0-9]{15,20}$/.test(data.tax)) return toast("请填写正确的公司税号");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return toast("请输入正确的电子邮箱");
  Object.assign(entity, data, { confirmed: true });
  syncEntityStatus();
  toast("开票主体已确认");
}

function fillInvoiceFromEntity() {
  const select = $("invoiceTitleSelect");
  $("entityNeededTip").classList.toggle("hidden", entity.confirmed);
  if (entity.confirmed) {
    select.innerHTML = `
      <option value="">请选择开票主体</option>
      <option value="confirmed">${escapeHtml(entity.company)}</option>
    `;
    select.disabled = false;
  } else {
    select.innerHTML = `<option value="">请选择开票主体</option>`;
    select.disabled = true;
  }
  select.value = "";
  $("remark").value = "";
  applySelectedInvoiceTitle();
}

function applySelectedInvoiceTitle() {
  const selected = $("invoiceTitleSelect").value === "confirmed" && entity.confirmed;
  const showTax = selected && isEnterprise(entity.type);
  $("invoiceTaxRow").classList.toggle("hidden", !showTax);
  $("invoiceTaxText").textContent = showTax ? entity.tax : "";
  $("invoiceEmailText").textContent = selected ? entity.email : "";
  const extras = [
    ["抬头类型", selected ? (isEnterprise(entity.type) ? "企业单位" : "非企业单位") : ""],
    ["开户银行", entity.bank],
    ["银行账号", entity.account],
    ["注册地址", entity.address],
    ["注册电话", entity.phone],
  ].filter(([, v]) => selected && v);
  $("invoiceEntityExtras").innerHTML = extras
    .map(([label, value]) => `<label class="form-row"><span>${label}</span><b>${escapeHtml(value)}</b></label>`)
    .join("");
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

function benefitItems(o) {
  if (Array.isArray(o.benefit)) return o.benefit.filter(Boolean);
  return String(o.benefit || "")
    .split(/[·\n；;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function openOrderDetail(id) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  state.currentOrder = o;
  const items = benefitItems(o);
  $("orderDrawerBody").innerHTML = `
    <section class="detail-hero">
      <span class="status ${statusClass(o.status)}">${o.statusText}</span>
      <div class="amount-big">¥${money(o.amount)}</div>
      <p>${escapeHtml(o.product)}</p>
    </section>
    <div class="section-title">订单信息</div>
    <section class="info-card">
      <div class="info-row"><span>订单编号</span><b>${escapeHtml(o.id)}</b></div>
      <div class="info-row"><span>产品</span><b>${escapeHtml(o.product)}</b></div>
      <div class="info-row"><span>版本</span><b>${escapeHtml(o.version)}</b></div>
      <div class="info-row"><span>价格</span><b>¥${money(o.price)}</b></div>
      <div class="info-row"><span>数量</span><b>${o.qty}</b></div>
      <div class="info-row"><span>订单金额</span><b>¥${money(o.amount)}</b></div>
      <div class="info-row"><span>订单状态</span><span class="status ${statusClass(o.status)}">${o.statusText}</span></div>
      <div class="info-row"><span>下单时间</span><b>${escapeHtml(o.date)}</b></div>
    </section>
    <div class="section-title">权益详情</div>
    <section class="benefit-card">
      ${
        items.length
          ? `<ul class="benefit-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : `<p class="benefit-empty">暂无权益说明</p>`
      }
    </section>
  `;
  const foot = $("orderDrawerFoot");
  foot.innerHTML = drawerActions(o);
  foot.hidden = !foot.innerHTML;
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
      <div class="info-row"><span>单位名称</span><b>${r.company}</b></div>
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
      ? `<button class="btn-ghost" data-resend="${r.id}">重新发送</button>`
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
  fillInvoiceFromEntity();
  closeOverlays();
  $("invoiceFormModal").hidden = false;
}

function goConfirmEntity() {
  closeOverlays();
  setModule("entity");
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
  if (!entity.confirmed || $("invoiceTitleSelect").value !== "confirmed") {
    toast("请先选择已确认的开票主体");
    return;
  }
  const company = entity.company;
  const tax = entity.tax;
  const email = entity.email;
  if (!email) return toast("请先在开票主体中填写电子邮箱");
  const selected = eligibleOrders().filter((o) => state.selected.has(o.id));
  const total = selected.reduce((s, o) => s + o.amount, 0);
  $("confirmBody").innerHTML = `
    <div class="info-row"><span>抬头类型</span><b>${isEnterprise(entity.type) ? "企业单位" : "非企业单位"}</b></div>
    <div class="info-row"><span>${isEnterprise(entity.type) ? "公司名称" : "发票抬头"}</span><b>${escapeHtml(company)}</b></div>
    ${isEnterprise(entity.type) ? `<div class="info-row"><span>公司税号</span><b>${escapeHtml(tax || "—")}</b></div>` : ""}
    <div class="info-row"><span>发票内容</span><b>*信息技术服务*平台服务费</b></div>
    <div class="info-row"><span>发票金额</span><b>¥${money(total)}</b></div>
    <div class="info-row"><span>电子邮箱</span><b>${escapeHtml(email)}</b></div>
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
    company: entity.company,
    tax: entity.tax,
    content: "*信息技术服务*平台服务费",
    email: entity.email,
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
  const t = e.target.closest("[data-module],[data-order-filter],[data-order-page],[data-invoice-view],[data-record-filter],[data-detail],[data-pay],[data-cancel],[data-invoice],[data-view-invoice],[data-select],[data-record-detail],[data-resend],[data-reopen],[data-retry],[data-close-drawer],[data-close-modal]");
  if (!t) return;

  if (t.dataset.module) setModule(t.dataset.module);
  if (t.dataset.orderFilter) {
    state.orderFilter = t.dataset.orderFilter;
    state.orderPage = 1;
    document.querySelectorAll("[data-order-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.orderFilter === state.orderFilter);
    });
    renderOrders();
  }
  if (t.dataset.orderPage) {
    if (t.disabled) return;
    if (t.dataset.orderPage === "prev") setOrderPage(state.orderPage - 1);
    else if (t.dataset.orderPage === "next") setOrderPage(state.orderPage + 1);
    else setOrderPage(t.dataset.orderPage);
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
$("invoiceTitleSelect").addEventListener("change", applySelectedInvoiceTitle);
$("goConfirmEntity").addEventListener("click", goConfirmEntity);
$("confirmEntity").addEventListener("click", confirmEntity);
$("entityForm").addEventListener("submit", (e) => {
  e.preventDefault();
  confirmEntity();
});
["entityCompany", "entityTax", "entityBank", "entityAccount", "entityAddress", "entityPhone", "entityEmail"].forEach((id) => {
  $(id).addEventListener("input", () => {
    if (!entity.confirmed) return;
    entity.confirmed = false;
    syncEntityStatus();
  });
});
document.querySelectorAll('input[name="entityType"]').forEach((el) => {
  el.addEventListener("change", () => {
    syncEntityTypeUI();
    if (!entity.confirmed) return;
    entity.confirmed = false;
    syncEntityStatus();
  });
});

syncEntityTypeUI();
syncEntityStatus();

$("orderPageGo").addEventListener("click", jumpOrderPage);
$("orderPageJump").addEventListener("keydown", (e) => {
  if (e.key === "Enter") jumpOrderPage();
});

document.addEventListener("click", (e) => {
  const card = e.target.closest(".order-card");
  if (card && !e.target.closest("button")) openOrderDetail(card.dataset.orderId);
});

syncEntityStatus();
refresh();
