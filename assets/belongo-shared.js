/* ============================================================
   BELONGO SHARED INTERACTIONS (design-demo grade, not production)
   Used by all hi-fi page designs. Behaviors:
   - [data-toggle="chatbot"]      → opens/closes #chatbot-panel
   - [data-toggle="mobile-menu"]  → opens/closes #site-mobile-menu
   - .site-header                 → gains .is-scrolled past 8px
   - [data-state-group] demos     → buttons with [data-show] reveal
                                    matching [data-state] panes
   - .toast [data-dismiss]        → hides the toast
   ============================================================ */
(function () {
  "use strict";

  // Chatbot open/close
  document.querySelectorAll('[data-toggle="chatbot"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById("chatbot-panel");
      if (!panel) return;
      var open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Mobile menu
  document.querySelectorAll('[data-toggle="mobile-menu"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var menu = document.getElementById("site-mobile-menu");
      if (!menu) return;
      var open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Sticky header shadow
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--overlay")) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Demo state switchers (foundations/spec pages)
  document.querySelectorAll("[data-state-group]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-show]");
    var panes = group.querySelectorAll("[data-state]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        panes.forEach(function (p) {
          p.style.display = p.getAttribute("data-state") === btn.getAttribute("data-show") ? "" : "none";
        });
      });
    });
  });

  // Generic full-screen overlay toggles: [data-toggle-overlay="#id"]
  // Used by g03 map view; reusable for future lightboxes/drawers.
  document.querySelectorAll("[data-toggle-overlay]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.querySelector(btn.getAttribute("data-toggle-overlay"));
      if (!el) return;
      var open = el.classList.toggle("is-open");
      el.setAttribute("aria-hidden", String(!open));
      btn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  });

  // Close open map overlay on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var ov = document.querySelector(".sr-mapoverlay.is-open");
    if (ov) { ov.classList.remove("is-open"); ov.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
  });

  // Prototype linking: any element with [data-href] is clickable,
  // but clicks on inner controls (a/button/input/label) still work.
  document.querySelectorAll("[data-href]").forEach(function (el) {
    el.style.cursor = "pointer";
    el.addEventListener("click", function (e) {
      if (e.target.closest("a, button, input, textarea, label, select")) return;
      window.location.href = el.getAttribute("data-href");
    });
  });

  // Toast dismiss
  document.querySelectorAll(".toast [data-dismiss]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = btn.closest(".toast");
      if (t) t.style.display = "none";
    });
  });
})();

/* ============================================================
   CONTEXTUAL HELP (design demo): a headset button on every page
   opens related questions with short answers for that page.
   ============================================================ */
(function () {
  "use strict";
var HELP = {
 g01:[["How does Belongo show prices?","Every price is the real total for your dates, with cleaning, service and taxes already included."],["What does guest-verified mean?","Past guests confirm details such as the walking distance to a mosque. Only people who stayed can add them."],["Is Belongo free to use?","Searching and booking are free. Joining Belongo Circle is free too."]],
 g02:[["How do I search for a stay?","Pick a destination, dates and guests, then press Search. Quick filters narrow results further."],["What is Belongo Circle?","A free membership with member rates and early access to deals. Higher recognition levels are earned over time."],["Can I search outside Dubai?","Yes. Change the destination field to any city we list."]],
 g03:[["What does the Sponsored label mean?","A host paid for that placement. It is always labelled and never changes the ranking of other results."],["Why do some stays show gold benefit lines?","Those hosts offer perks to recognised guests such as you. They appear first for you."],["How do I use the map?","Press Map to see results by area, and look for the mosque marker to see guest-verified distances."]],
 g04:[["Is the price final?","Yes. The total includes all fees and taxes, and you confirm it again at checkout."],["Can I gift this stay?","Yes. Press Gift this stay to someone, then add their details. They choose their dates."],["What is the cancellation policy?","It is shown before you pay. This stay offers free cancellation until the date shown."]],
 g05:[["Why can I pay only part now?","Some hosts accept a deposit. When they do, you pay a share now and the rest before arrival."],["Is my payment secure?","Payments are handled by Stripe. Belongo never stores your full card number."],["What happens after I pay?","You get a confirmation by email with check-in steps and your booking reference."]],
 g06:[["What happens next?","The host is notified, and you receive check-in details closer to your stay."],["Where can I find my booking?","Open My bookings from the menu at any time."],["Can I change my dates?","Yes, from the booking page, subject to the host's rules and availability."]],
 g07:[["Do I need an account to book?","No. You can continue as a guest. An account lets you save stays and see your history."],["What are preferences?","Optional choices such as prayer-friendly amenities. They help us show stays that suit you."],["I forgot my password","Choose Forgot password and we will email you a reset link."]],
 g08:[["How do I rebook a past trip?","Open a past trip and press Rebook. You can keep the same room or choose another."],["Where is my check-in code?","It appears on the booking page a day before arrival."],["What is the balance due notice?","It reminds you to pay the remaining amount of a part-payment booking."]],
 g09:[["How do I change my dates?","Press Change dates. The new price is shown before you confirm."],["Where are my check-in details?","They are on this page, including the code and the host's directions."],["How do I contact the host?","Use Message host on this page. Replies usually arrive within an hour."]],
 g10:[["When will I get my refund?","The refund timeline on this page shows each step and when the money lands."],["How much will I get back?","It depends on the cancellation policy and how close the stay is. The exact amount is shown first."],["Can I keep the booking instead?","Yes. Press Keep booking to go back without any changes."]],
 g11:[["How do I change my language?","Open Preferences on this page and pick a language. Arabic switches the whole layout to right to left."],["How do I turn on two-factor sign-in?","Open Security and press Turn on. We will walk you through it."],["How do I delete my account?","At the bottom of this page. It removes your trips, reviews and Circle status."]],
 g12:[["Which payment methods can I use?","Cards and local methods such as mada and Apple Pay, depending on your country."],["Are my cards stored safely?","Yes. Cards are stored by our payment provider, not by Belongo."],["How do I remove a card?","Press Remove next to the card."]],
 g13:[["What makes a good review?","Be specific about cleanliness, location and the host. Photos help the next guest."],["What is Add a nearby place?","You can add places, like a mosque or market, with photos and real walking distances."],["Do reviews earn anything?","Helpful reviews and nearby places count toward recognition."]],
 g14:[["What is Belongo?","A booking platform that shows the whole price and checks details with real guests."],["How is Belongo different?","No hidden fees, guest-verified facts and prayer-aware details built in."],["Where can I read more?","See Contact, or ask the Concierge."]],
 g15:[["How do I reach support?","Send a message here. A person replies, usually within two minutes during opening hours."],["Is there a phone number?","Yes, it is listed on this page with the support hours."],["Where is my answer?","Quick answers to common questions are above the form."]],
 g16:[["What data do you collect?","Only what is needed to book and to support you. The page lists each type."],["Do you sell my data?","No. We share only what each partner needs to do their job."],["How do I delete my data?","Delete your account in Settings, or contact support."]],
 g17:[["What are the main rules?","The page explains bookings, payments, cancellations and conduct in plain language."],["Who do the terms apply to?","Guests and hosts who use Belongo."],["Where do I ask a question?","Contact support from the menu."]],
 g18:[["Why is the price shown as a total?","So you always see what you will pay. Fees are never added later."],["How do refunds work?","Refunds follow the cancellation policy and go back to your original payment method."],["Which currencies are supported?","Prices show in AED. Other currencies convert at the day's rate."]],
 g19:[["What is this page?","A preview of how Belongo looks in Arabic, with the layout mirrored right to left."],["Will all pages be in Arabic?","Yes, once the English design is approved."],["Can I switch language?","Yes, in Account settings."]],
 g20:[["How does gifting work?","Pick an amount, add the person's details and a message, and we email them a gift card."],["Can they choose any stay?","Yes. The value applies to any Belongo stay and combines with member rates."],["When does a gift expire?","Gifts stay valid for 24 months."]],
 g21:[["Where are my saved stays?","Everything you heart appears here, with your recent searches."],["How do I remove a saved stay?","Press the heart again."],["Can I share my shortlist?","Yes, use Share to send it to your group."]],
 g22:[["What does the recipient get?","This exact stay, prepaid. They can keep the dates or pick new ones."],["Can they use it somewhere else?","Yes. The value transfers as credit to another Belongo stay."],["Can I cancel the gift?","Yes, for free until it is opened."]],
 g24:[["When does she get the gift?","By email today, or on the date you chose."],["What if my payment failed?","Nothing is sent and you are not charged. Try another card."],["Can I cancel it?","Yes, for free until it is opened."]],
 g25:[["How do I use this gift?","Press Choose your dates and pick any dates the stay is open."],["Can I use it somewhere else?","Yes. The value works on any Belongo stay."],["Do I need an account?","No. You can book as a guest."]],
 g23:[["What are the levels?","Circle, Verified, Ambassador and Elite. They reflect trust and contribution, never payment."],["How do I move up?","Strong reviews from hosts, referrals and nearby places help. Belongo reviews and grants each level."],["What do I get?","Hosts decide. Participating stays show gold labels such as Welcome Gift Included."]],
 h01:[["How much does hosting cost?","A flat commission from 12% of each booking, all in. No listing fees."],["How do I start?","Press Start listing and follow the six short steps."],["Who pays me and when?","Belongo pays out 48 hours after the guest checks in."]],
 h02:[["What do the cards show?","Occupancy, revenue and today's arrivals for your properties."],["How do I switch property?","Use the property switcher at the top of the sidebar."],["What needs my attention?","The tasks list shows messages and bookings that are waiting for you."]],
 h03:[["Is my progress saved?","Yes. It saves automatically and you can leave and return."],["How long does it take?","About ten minutes for a first listing."],["What happens when I finish?","Belongo reviews the listing, then it goes live."]],
 h04:[["Do I need to confirm bookings?","No. Bookings confirm by themselves. Open one to message the guest or mark them checked in."],["What do the statuses mean?","Pending is waiting for you, Confirmed is booked, Completed has been stayed."],["How do I contact a guest?","Open the booking and use Message guest."]],
 h05:[["How do I block dates?","Select the dates and choose Block. Guests cannot book them."],["What is a sync conflict?","Another calendar changed the same dates. You choose which one to keep."],["Can I set different prices by day?","Yes, in Pricing."]],
 h06:[["How do I add a property?","Press Add property and follow the steps."],["What is listing completeness?","A score for how complete each listing is. Higher scores rank better."],["How do I pause a listing?","Open it and choose Pause."]],
 h07:[["What is smart pricing?","Belongo adjusts your nightly rate within your range by demand and local events."],["Can I set my own rules?","Yes. Weekend, season, last-minute and length-of-stay rules are all optional."],["Where do I allow deposits?","Part-payment is controlled per listing. Guests only see it when you allow it."]],
 h08:[["How do I reply to a review?","Open it, write your reply and press Post. Replies are public."],["Can I remove a review?","Not unless it breaks our guidelines. You can report it."],["How does my rating count?","Your average rating affects ranking and your Preferred Host badge."]],
 h09:[["What can I record here?","Running costs such as cleaning, repairs and utilities."],["Can I attach receipts?","Yes, add a photo or file to each expense."],["Do expenses affect my payout?","No. They feed your profit and loss report."]],
 h10:[["How is profit calculated?","Revenue minus Belongo commission and your recorded expenses."],["Can I download this?","Yes, as PDF or Excel from the Export button."],["When are payouts sent?","48 hours after each guest checks in."]],
 h11:[["What are leases?","Long-stay tenants with a contract, dates and rent."],["How do renewals work?","You get a reminder before each lease ends."],["Can guests and tenants mix?","Yes. They are tracked separately."]],
 h15:[["Do changes go live straight away?","Yes for most details. New photos are checked by Belongo first."],["How do I stop bookings for a while?","Press Pause listing at the bottom. Existing bookings stay."],["Where do I change my price?","Open the Pricing and rules tab, or use the Pricing page for rules by date."]],
 h14:[["What can I do with a booking?","Message the guest, mark them checked in, resend their confirmation, or cancel."],["When do I get paid?","48 hours after the guest checks in."],["What is not in my payout?","The guest service fee and tourism tax. Belongo collects those."]],
 h12:[["What is the recognition programme?","A free way to welcome trusted guests and offer them perks you choose."],["Do I have to take part?","No. It is optional and you can leave anytime."],["What do I get?","Higher placement for recognised guests and a Preferred Host badge."]],
 h13:[["Where do payouts go?","To the bank account listed under Payouts."],["How do I change my password?","Open Security and press Change."],["Can I get fewer emails?","Yes. Switch off any alert under Notifications."]],
 a01:[["What does Gross merchandise value mean?","The total value of bookings made, before commission is taken."],["How do I filter by country?","Use the country switcher at the top of the sidebar."],["Can I export these numbers?","Yes, from Reports."]],
 a02:[["How is commission revenue calculated?","Each booking's total multiplied by the commission rate in Platform defaults."],["Do the numbers reconcile?","Revenue minus cost lines gives the margin shown, and it matches Expenses."],["How do I export?","Use the Export button."]],
 a03:[["How is RevPAR calculated?","Average daily rate multiplied by occupancy."],["What does occupancy show?","The share of available nights that were booked."],["Can I compare countries?","Yes. Switch country at the top of the sidebar."]],
 a04:[["What can each role do?","The list below the table explains every role."],["How do I invite someone?","Press Invite user, choose a role and a scope."],["How do I remove access?","Open the person and choose Remove."]],
 a05:[["What is an approval?","Larger expenses wait for a manager to approve before they count."],["How do I add a budget line?","Press Add expense and pick a category."],["Does this match the financials?","Yes. Operating spend adds up to the cost lines in Financials."]],
 a06:[["How do I build a report?","Choose a type and date range, then press Generate."],["Where is my export?","It appears in the queue below once it is ready."],["Why did an export fail?","Press Retry. If it fails again, contact the platform team."]],
 a07:[["How do I review an application?","Open it, check the ID result and press Approve or Reject."],["Why is approval manual?","Belongo wants every partner checked by a person."],["What happens on approval?","The partner gets one region and can manage listings there."]],
 a08:[["What can each partner level do?","Pending and Approved listings are reviewed first. Trusted Curators publish directly."],["How do regions work?","Each partner sees only the listings in the region assigned to them."],["What is a Regional Leader?","A future role that supervises several partners."]],
 a09:[["How are levels granted?","By hand, or by approving a suggestion from the automatic rules."],["What does Suggest only do?","It lists guests who meet a rule. Nothing is granted until you approve."],["Can I change a level later?","Yes, press Change level on the row."]],
 a11:[["How does the ERP sync work?","Belongo reads invoices and payment status from the ERP through its API. It never writes back."],["What is a mismatch?","The ERP and Belongo disagree on an amount or status. Review it and choose which value to keep."],["How often does it update?","Every 15 minutes, and within seconds if the ERP sends a webhook. Press Sync now to pull straight away."]],
 a10:[["What are platform defaults?","Settings that apply to every new host and market unless a country overrides them."],["Where do I change my password?","Under Security on this page."],["Who can see these settings?","Only platform admins."]],
 p01:[["Who can apply?","Anyone with strong local knowledge of stays in their city."],["How long does review take?","You hear from us within seven days."],["Do I need to upload ID?","Yes. It is used only to confirm who you are."]],
 p02:[["What do I see here?","Only the listings and bookings in your assigned region."],["How do I reach Trusted Curator?","Quality score of 95, ten live listings and six months active."],["What needs my attention?","Out of date prices, draft listings and questions from Belongo."]],
 p03:[["Why only nine listings?","You see only the properties assigned to you."],["What does In review mean?","Belongo is checking the listing before it goes live."],["How do I add a property?","Press Add property."]],
 p04:[["Who checks my listing?","Belongo reviews every new listing before it is published."],["How many photos do I need?","At least ten."],["Can I save and finish later?","Yes. Choose Save as draft."]],
 p05:[["Do price changes apply straight away?","Yes. Changes of more than 25% are flagged to Belongo."],["How do I block dates?","Choose Blocked in the update form."],["Can I set weekend prices?","Yes. A weekend uplift is already applied."]],
 p06:[["What can I do with a booking?","View it and follow its status. The host manages the guest."],["What does Upcoming mean?","The guest has not arrived yet."],["Who pays the guest's refund?","Belongo handles refunds."]],
 p07:[["How is my commission calculated?","Currently 3% of each booking total. This is a sample rule that is yet to be confirmed."],["When am I paid?","When the guest's stay is completed."],["Can I download a statement?","Yes, press Download statement."]],
 p08:[["Who am I talking to?","Your Belongo country manager."],["How fast will they reply?","Usually within a working day."],["Where do notifications come from?","From bookings, prices and your quality score."]],
 p09:[["Where do commissions go?","To the payout account listed on this page."],["Can I change my region?","No. Contact your country manager."],["How do I change my password?","Open Security and press Change."]]
};

  var m = location.pathname.match(/belongo-([ghap]\d\d)-/);
  var items = m && HELP[m[1]];
  if (!items) return;
  var SUPPORT = "https://noushweb.github.io/belongo-client-prototype/belongo-g15-contact.html";
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.2-1.5 2-4 2h-2"/></svg>';
  var wrap = document.createElement("div");
  wrap.className = "ah-wrap";
  var list = items.map(function (it, i) { return '<button type="button" class="ah-q" data-i="' + i + '">' + it[0] + "</button>"; }).join("");
  wrap.innerHTML =
    '<button type="button" class="ah-btn" aria-haspopup="true" aria-expanded="false" aria-label="Help for this page">' + ICON + '<span class="ah-tip">Help</span></button>' +
    '<div class="ah-panel" role="dialog" aria-label="Help for this page"><div class="ah-view ah-list"><div class="ah-title">Help for this page</div>' + list + '</div>' +
    '<div class="ah-view ah-answer" hidden><button type="button" class="ah-back">&larr; All questions</button><div class="ah-aq"></div><p class="ah-aa"></p><a class="ah-more" href="' + SUPPORT + '">Still stuck? Contact support</a></div></div>';
  var host = document.querySelector(".hs-top-actions") || document.querySelector(".site-actions");
  if (host) { host.insertBefore(wrap, host.firstChild); } else { wrap.classList.add("ah-fixed"); document.body.appendChild(wrap); }
  var btn = wrap.querySelector(".ah-btn"), panel = wrap.querySelector(".ah-panel");
  var vList = wrap.querySelector(".ah-list"), vAns = wrap.querySelector(".ah-answer");
  function show(open) { panel.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); if (open) { vList.hidden = false; vAns.hidden = true; } }
  btn.addEventListener("click", function (e) { e.stopPropagation(); show(!panel.classList.contains("is-open")); });
  panel.addEventListener("click", function (e) {
    e.stopPropagation();
    var q = e.target.closest(".ah-q"), back = e.target.closest(".ah-back");
    if (q) { var it = items[+q.getAttribute("data-i")]; wrap.querySelector(".ah-aq").textContent = it[0]; wrap.querySelector(".ah-aa").textContent = it[1]; vList.hidden = true; vAns.hidden = false; }
    if (back) { vList.hidden = false; vAns.hidden = true; }
  });
  document.addEventListener("click", function () { show(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") show(false); });
})();

/* ============================================================
   APP ACTIONS (design demo): every action button in the host,
   admin and partner screens shows an outcome: a confirmation
   toast, a slide-in form, an inline status, or inline editing.
   ============================================================ */
(function () {
  "use strict";
  var m = location.pathname.match(/belongo-([hap]\d\d)-/);
  if (!m) return;
  var PID = m[1];
  function norm(s) { return (s || "").replace(/[＋↧⇩✎✓◍▾→✦+]/g, "").replace(/\s+/g, " ").trim().toLowerCase(); }
  var toastEl, toastTimer;
  function toast(msg, o) {
    o = o || {};
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "bt-toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<span class="bt-tick' + (o.error ? " is-err" : "") + '">' + (o.error ? "!" : "&#10003;") + '</span><span class="bt-msg"></span>' + (o.action ? '<button type="button" class="bt-act">' + o.action + "</button>" : "");
    toastEl.querySelector(".bt-msg").textContent = msg;
    toastEl.classList.toggle("is-error", !!o.error);
    if (o.action) { toastEl.querySelector(".bt-act").onclick = function () { toastEl.classList.remove("is-on"); if (o.fn) o.fn(); }; }
    toastEl.classList.add("is-on"); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, o.action ? 8000 : 4200);
  }
  window.BT = window.BT || {}; window.BT.toast = toast;
  /* ---- slide-in form ---- */
  var dr, drBack;
  function closeDrawer() { if (dr) { dr.classList.remove("is-on"); drBack.classList.remove("is-on"); } }
  function openDrawer(cfg, onDone) {
    if (!dr) {
      drBack = document.createElement("div"); drBack.className = "bt-back"; drBack.addEventListener("click", closeDrawer);
      dr = document.createElement("aside"); dr.className = "bt-drawer"; dr.setAttribute("role", "dialog"); dr.setAttribute("aria-modal", "true");
      document.body.appendChild(drBack); document.body.appendChild(dr);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
    }
    var f = cfg.fields.map(function (x, i) {
      var id = "bt-f" + i, lab = '<label class="bt-l" for="' + id + '">' + x.l + "</label>";
      var rq = (x.r ? ' data-req="' + x.r + '"' : "") + (x.dt ? ' data-type="' + x.dt + '"' : "");
      if (x.t === "select") return '<div class="bt-f">' + lab + '<select class="bt-i" id="' + id + '"' + rq + '>' + x.o.map(function (o) { return "<option>" + o + "</option>"; }).join("") + "</select></div>";
      if (x.t === "area") return '<div class="bt-f">' + lab + '<textarea class="bt-i" id="' + id + '" rows="5"' + rq + '>' + (x.v || "") + "</textarea></div>";
      return '<div class="bt-f">' + lab + '<input class="bt-i" id="' + id + '" type="' + (x.t || "text") + '"' + rq + ' value="' + (x.v || "") + '" placeholder="' + (x.p || "") + '"></div>';
    }).join("");
    dr.innerHTML = '<div class="bt-head"><h2>' + cfg.title + '</h2><button type="button" class="bt-x" aria-label="Close">&times;</button></div>' + (cfg.lead ? '<p class="bt-lead">' + cfg.lead + "</p>" : "") + '<div class="bt-body">' + f + '</div><div class="bt-foot"><button type="button" class="btn btn-secondary btn-md bt-cancel">Cancel</button><button type="button" class="btn btn-premium btn-md bt-go">' + cfg.go + "</button></div>";
    dr.querySelector(".bt-x").onclick = closeDrawer; dr.querySelector(".bt-cancel").onclick = closeDrawer;
    dr.querySelector(".bt-go").onclick = function () {
      if (!window.BT.validate(dr)) return;
      var vals = [].map.call(dr.querySelectorAll(".bt-i"), function (e) { return e.value; });
      window.BT.busy(this, "Saving\u2026", function () {
        closeDrawer(); toast(typeof cfg.done === "function" ? cfg.done(vals) : cfg.done, cfg.undo ? { action: "Undo", fn: cfg.undo } : null); if (onDone) onDone(vals);
      });
    };
    dr.classList.add("is-on"); drBack.classList.add("is-on");
    var first = dr.querySelector(".bt-i"); if (first) setTimeout(function () { first.focus(); }, 60);
  }
  var ROLES = ["Super admin", "Country manager", "Finance", "Support", "Analyst"];
  var COUNTRIES = ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Kuwait"];
  var LEVELS = ["Verified", "Ambassador", "Elite"];
  var DRAWERS = {
    "a04|invite user": { title: "Invite a team member", lead: "They get an email to set up their account.", go: "Send invite", fields: [{ l: "Email", p: "name@belongo.co", r: "Enter the person's email", dt: "email" }, { l: "Role", t: "select", o: ROLES }, { l: "Scope", t: "select", o: ["All countries"].concat(COUNTRIES) }], done: function (v) { return "Invite sent to " + (v[0] || "the new team member") + " as " + v[1] + "."; } },
    "a05|add expense": { title: "Add an expense", lead: "Larger amounts wait for approval.", go: "Submit expense", fields: [{ l: "Category", t: "select", o: ["Payment processing", "Cloud and tools", "Support staff", "Marketing", "Legal and compliance"] }, { l: "Amount (AED)", p: "0.00", r: "Enter an amount", dt: "number" }, { l: "Note", p: "What is this for?" }], done: "Expense submitted for approval." },
    "a06|generate report": { title: "Generate a report", lead: "It appears in the export queue when ready.", go: "Generate", fields: [{ l: "Report", t: "select", o: ["Financial summary", "Occupancy and RevPAR", "Partner commissions", "Recognition grants"] }, { l: "Period", t: "select", o: ["September 2026", "Q3 2026", "Last 6 months", "Year to date"] }, { l: "Format", t: "select", o: ["PDF", "Excel"] }], done: "Report queued. You will find it in the export queue below." },
    "a07|invite partner": { title: "Invite a partner", lead: "They receive a link to the application.", go: "Send invitation", fields: [{ l: "Name", r: "Enter the partner's name" }, { l: "Email", p: "name@example.com", r: "Enter their email", dt: "email" }, { l: "Region", t: "select", o: ["Sharjah, UAE", "Riyadh, Saudi Arabia", "Doha, Qatar", "Muscat, Oman", "Manama, Bahrain"] }], done: function (v) { return "Invitation sent to " + (v[0] || "the partner") + "."; } },
    "a08|edit level rules": { title: "Edit Trusted Curator rules", lead: "Applies to partners who have not yet reached the level.", go: "Save rules", fields: [{ l: "Minimum quality score", v: "95" }, { l: "Minimum live listings", v: "10" }, { l: "Minimum months active", v: "6" }], done: "Level rules saved." },
    "a09|grant recognition": { title: "Grant recognition", lead: "Levels are earned. Add the reason for the record.", go: "Grant level", fields: [{ l: "Guest", p: "Search by name or email", r: "Choose a guest" }, { l: "Level", t: "select", o: LEVELS }, { l: "Reason", t: "area", v: "" }], done: function (v) { return (v[0] || "The guest") + " is now " + v[1] + "."; } },
    "h05|block dates": { title: "Block dates", lead: "Guests cannot book blocked dates.", go: "Block dates", fields: [{ l: "Unit", t: "select", o: ["Downtown Calm Studio", "Marina Skyline 2-Bed", "Bur Dubai Souq Loft", "JBR Beachfront 2-Bed"] }, { l: "From", t: "date", v: "2026-09-25" }, { l: "To", t: "date", v: "2026-09-27" }, { l: "Reason", p: "Owner stay, maintenance" }], done: "Dates blocked. They are removed from search." },
    "h09|add expense": { title: "Add an expense", lead: "It feeds your profit and loss report.", go: "Save expense", fields: [{ l: "Property", t: "select", o: ["All properties", "Downtown Calm Studio", "Marina Skyline 2-Bed", "Bur Dubai Souq Loft", "JBR Beachfront 2-Bed"] }, { l: "Category", t: "select", o: ["Cleaning", "Repairs", "Utilities", "Supplies"] }, { l: "Amount (AED)", p: "0.00", r: "Enter an amount", dt: "number" }], done: "Expense saved." },
    "h11|add lease": { title: "Add a lease", lead: "You get a reminder before it ends.", go: "Save lease", fields: [{ l: "Tenant name", r: "Enter the tenant's name" }, { l: "Unit", t: "select", o: ["Marina Skyline 2-Bed", "Bur Dubai Souq Loft"] }, { l: "Monthly rent (AED)", p: "0", r: "Enter the monthly rent", dt: "number" }, { l: "Start date", t: "date", v: "2026-10-01" }], done: "Lease saved. A renewal reminder is set." },
    "h15|pause listing": { title: "Pause this listing", lead: "It is hidden from search. Existing bookings stay.", go: "Pause listing", fields: [{ l: "Reason", t: "select", o: ["Maintenance", "Owner stay", "Renovation", "Other"] }, { l: "Pause until", t: "date", v: "2026-10-15" }], done: "Listing paused. It no longer appears in search." },
    "h14|message guest": { title: "Message the guest", lead: "They get it by email and in their Belongo inbox.", go: "Send message", fields: [{ l: "Your message", t: "area", v: "", r: "Write a message first" }], done: function () { return "Message sent to " + (document.getElementById("bk-guest") || {}).textContent + "."; } },
    "h14|cancel booking": { title: "Cancel this booking", lead: "The guest is refunded in full and told why. Belongo may charge a host cancellation fee.", go: "Cancel booking", fields: [{ l: "Reason", t: "select", o: ["Property not available", "Maintenance problem", "Double booking", "Other"] }, { l: "Note to the guest", t: "area", v: "" }], done: "Booking cancelled. The guest has been refunded in full and emailed." },
    "h08|reply": { title: "Reply to this review", lead: "Replies are public.", go: "Post reply", fields: [{ l: "Your reply", t: "area", v: "", r: "Write a reply first" }], done: "Reply posted." },
    "h08|suggest a reply": { title: "Suggested reply", lead: "Written by Belongo. Edit it before you post.", go: "Post reply", fields: [{ l: "Your reply", t: "area", v: "Thank you for staying with us and for the kind words. We are glad the studio felt calm and easy, and we would love to host you again." }], done: "Reply posted." }
  };
  var TOASTS = {
    "save changes": "Changes saved.", "save": "Saved.",
    "export": "Export started. We will email it when it is ready.", "download statement": "Your statement is downloading.",
    "apply update": "Prices updated for 25 to 30 Sep.", "resolve": "Conflict resolved. The calendar is back in sync.",
    "manage": "Opens two-factor setup and recovery codes.", "review": "Opens the list of signed-in devices.",
    "request resubmission": "Resubmission requested. The applicant has been emailed.",
    "resend confirmation": "Confirmation email sent again.",
    "save as draft": "Draft saved. Finish it any time from your listings."
  };
  function rowOf(el) { return el.closest(".tbl-row"); }
  function setStatus(el, cls, text) { var cell = el.closest(".pt-act") || el.parentNode, old = cell.innerHTML; cell.innerHTML = '<span class="badge ' + cls + '">' + text + "</span>"; return function () { cell.innerHTML = old; }; }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a[href='#'], button");
    if (!el || el.closest(".ah-wrap, .bt-drawer, .chatbot-panel, .chatbot-fab")) return;
    if (el.hasAttribute("data-toggle") || el.hasAttribute("data-toggle-sidebar") || el.hasAttribute("data-switcher") || el.hasAttribute("data-show") || el.hasAttribute("data-toggle-overlay") || el.classList.contains("hs-bell") || el.classList.contains("hs-burger")) return;
    var label = norm(el.textContent), key = PID + "|" + label;
    var row = rowOf(el), name = row && row.querySelector(".tbl-name b") ? row.querySelector(".tbl-name b").textContent : "";
    /* inline edit in settings */
    if (el.classList.contains("st-edit") && (label === "change" || el.dataset.editing)) {
      e.preventDefault(); var v = el.parentNode.querySelector(".st-v");
      if (el.dataset.editing) { var inp = v.querySelector("input"); v.textContent = inp.value || inp.defaultValue; el.textContent = "Change"; delete el.dataset.editing; toast("Saved."); }
      else { var cur = v.textContent.trim(); v.innerHTML = '<input class="bt-i" type="text" value="' + cur.replace(/"/g, "&quot;") + '" aria-label="New value">'; el.textContent = "Save"; el.dataset.editing = "1"; v.querySelector("input").focus(); }
      return;
    }
    /* row outcomes */
    if (PID === "a07" && row) {
      if (label === "approve") { e.preventDefault(); var reg = (row.querySelector("[data-label='Region']") || {}).textContent || ""; var undoA = setStatus(el, "badge-available", "Approved"); toast(name + " approved. Region assigned: " + reg + ". They have been emailed.", { action: "Undo", fn: undoA }); return; }
      if (label === "reject") { e.preventDefault(); var undoR; openDrawer({ title: "Reject " + name, lead: "They are told why by email.", go: "Reject application", fields: [{ l: "Reason", t: "select", o: ["ID could not be verified", "Not enough local experience", "Region already covered", "Other"] }, { l: "Note to the applicant (optional)", t: "area", v: "" }], done: name + " rejected. They are told why by email.", undo: function () { if (undoR) undoR(); } }, function () { undoR = setStatus(el, "badge-pending", "Rejected"); }); return; }
      if (label === "request resubmission") { e.preventDefault(); setStatus(el, "badge-pending", "Waiting for new photo"); toast("Resubmission requested from " + name + "."); return; }
    }
    if (PID === "a09" && row) {
      if (label === "approve") { e.preventDefault(); var lv = (row.querySelector(".rec-badge") || {}).textContent || "the level"; var undoG = setStatus(el, "badge-available", "Granted"); toast(name + " is now " + lv.replace(/[^\w ]/g, "").trim() + ".", { action: "Undo", fn: undoG }); return; }
      if (label === "dismiss") { e.preventDefault(); var undoD = setStatus(el, "badge-booked", "Dismissed"); toast("Suggestion dismissed for " + name + ".", { action: "Undo", fn: undoD }); return; }
      if (label === "change level") { e.preventDefault(); openDrawer({ title: "Change level for " + name, lead: "Levels are earned. Add the reason for the record.", go: "Save level", fields: [{ l: "New level", t: "select", o: ["Circle"].concat(LEVELS) }, { l: "Reason", t: "area", v: "" }], done: name + "'s level updated." }); return; }
    }
    if (PID === "h14" && label === "mark as checked in") { e.preventDefault(); var st = document.getElementById("bk-status"); if (st) { st.textContent = "In-house"; st.className = "badge badge-verified"; } toast("Marked as checked in."); return; }
    if (DRAWERS[key]) { e.preventDefault(); openDrawer(DRAWERS[key]); return; }
    if (PID === "p01" && label === "submit application") {
      e.preventDefault(); var body = document.querySelector(".ca-body");
      var okF = window.BT.validate(body), idBox = document.querySelector(".ca-id");
      if (idBox && idBox.getAttribute("data-done") !== "1") { window.BT.setError(idBox.querySelector("input") || idBox, "Upload your passport or Emirates ID"); if (okF) idBox.scrollIntoView({ block: "center" }); okF = false; }
      if (!okF) return;
      if (body) { body.innerHTML = '<div class="ca-card" style="grid-column:1/-1;text-align:center;padding:var(--space-10) var(--space-6)"><div style="width:64px;height:64px;border-radius:50%;background:var(--color-success);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:var(--space-4)">&#10003;</div><h2 style="font-size:var(--text-xl);margin-bottom:var(--space-2)">Application received</h2><p style="color:var(--color-warm-gray);max-width:460px;margin:0 auto;line-height:1.65;font-size:var(--text-sm)">Thank you. We are checking your ID now, and a person at Belongo will review your application. You will hear from us within seven days.</p></div>'; window.scrollTo(0, 0); }
      return;
    }
    if (PID === "p04" && label === "submit for review") {
      e.preventDefault(); var scope2 = document.querySelector(".ap-wrap");
      if (scope2 && window.BT.validate(scope2)) { window.BT.busy(el, "Submitting\u2026", function () { location.href = "belongo-p03-partner-listings.html?msg=submitted"; }); }
      return;
    }
    if (PID === "p08" && label === "send") {
      e.preventDefault(); var inp2 = document.querySelector(".pm-send input"); var txt = inp2 && inp2.value.trim();
      if (txt) { var b = document.createElement("div"); b.className = "pm-msg out"; b.textContent = txt; var s = document.createElement("small"); s.textContent = "You · just now"; b.appendChild(s); var send = document.querySelector(".pm-send"); send.parentNode.insertBefore(b, send); inp2.value = ""; }
      else { toast("Write a message first."); }
      return;
    }
    if (/^(save changes|save|apply update)$/.test(label) && (el.getAttribute("href") === "#" || el.tagName === "BUTTON")) {
      e.preventDefault();
      if (el.getAttribute("aria-disabled") === "true" && !el.classList.contains("is-busy")) { toast("There are no changes to save yet."); return; }
      var scope = document.querySelector(".ap-wrap, .ep-wrap, .pa-wrap");
      if (scope && !window.BT.validate(scope)) return;
      window.BT.busy(el, "Saving\u2026", function () { toast(TOASTS[label]); if (window.BT.markClean) window.BT.markClean(); });
      return;
    }
    if (TOASTS[label] && (el.getAttribute("href") === "#" || el.tagName === "BUTTON")) { e.preventDefault(); toast(TOASTS[label]); }
  });
})();

/* ============================================================
   FORM STATES (design demo): field validation, saving / failure /
   retry, uploads, unsaved changes, empty and no-results states.
   Add ?fail=1 to any page URL to see the failure + retry state,
   and ?empty=1 on list pages to see the empty state.
   ============================================================ */
(function () {
  "use strict";
  var BT = window.BT = window.BT || {};
  var Q = new URLSearchParams(location.search);
  BT.fail = Q.get("fail") === "1";
  if (!BT.toast) {
    var te, tt;
    BT.toast = function (msg, o) {
      o = o || {};
      if (!te) { te = document.createElement("div"); te.className = "bt-toast"; te.setAttribute("role", "status"); document.body.appendChild(te); }
      te.innerHTML = '<span class="bt-tick' + (o.error ? " is-err" : "") + '">' + (o.error ? "!" : "&#10003;") + '</span><span class="bt-msg"></span>' + (o.action ? '<button type="button" class="bt-act">' + o.action + "</button>" : "");
      te.querySelector(".bt-msg").textContent = msg; te.classList.toggle("is-error", !!o.error);
      if (o.action) te.querySelector(".bt-act").onclick = function () { te.classList.remove("is-on"); if (o.fn) o.fn(); };
      te.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(function () { te.classList.remove("is-on"); }, o.action ? 8000 : 4200);
    };
  }
  /* ---- validation ---- */
  BT.setError = function (el, msg) {
    var wrap = el.closest(".au-pw") || el, nx = wrap.nextElementSibling;
    if (nx && nx.classList.contains("bt-err")) nx.remove();
    el.removeAttribute("aria-invalid"); el.classList.remove("bt-bad");
    if (!msg) return;
    el.setAttribute("aria-invalid", "true"); el.classList.add("bt-bad");
    var s = document.createElement("span"); s.className = "bt-err"; s.setAttribute("role", "alert"); s.textContent = msg;
    wrap.parentNode.insertBefore(s, wrap.nextSibling);
    if (!el._bt) { el._bt = 1; el.addEventListener("input", function () { BT.setError(el, null); }); el.addEventListener("change", function () { BT.setError(el, null); }); }
  };
  BT.validate = function (root) {
    var first = null;
    root.querySelectorAll("[data-req]").forEach(function (el) {
      if (el.offsetParent === null && !el.closest(".ep-pane")) return;
      var v = (el.value || "").trim(), dt = el.getAttribute("data-type"), msg = null;
      if (!v) msg = el.getAttribute("data-req") || "This field is required";
      else if (dt === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address";
      else if (dt === "number" && !(parseFloat(v.replace(/,/g, "")) > 0)) msg = "Enter an amount greater than 0";
      else if (dt === "pw8" && v.length < 8) msg = "Use at least 8 characters";
      else if (dt === "card" && v.replace(/\D/g, "").length < 13) msg = "Enter the full card number";
      BT.setError(el, msg); if (msg && !first) first = el;
    });
    if (first) {
      var pane = first.closest(".ep-pane");
      if (pane && pane.hidden) { var tab = document.querySelector('.ep-tab[data-pane="' + pane.getAttribute("data-pane") + '"]'); if (tab) tab.click(); }
      first.focus(); if (first.scrollIntoView) first.scrollIntoView({ block: "center" });
    }
    return !first;
  };
  /* ---- busy / failure / retry ---- */
  BT.busy = function (btn, label, work) {
    if (btn.getAttribute("aria-disabled") === "true" && btn.classList.contains("is-busy")) return;
    var orig = btn.innerHTML, was = btn.getAttribute("aria-disabled");
    btn.setAttribute("aria-disabled", "true"); btn.classList.add("is-busy"); btn.innerHTML = label;
    setTimeout(function () {
      btn.classList.remove("is-busy"); btn.innerHTML = orig; if (was) btn.setAttribute("aria-disabled", was); else btn.removeAttribute("aria-disabled");
      if (BT.fail) { BT.fail = false; BT.toast("Could not complete that. Nothing was lost. Check your connection and try again.", { error: true, action: "Retry", fn: function () { BT.busy(btn, label, work); } }); }
      else { work(); }
    }, 800);
  };
  /* ---- unsaved changes ---- */
  var saveBtn = null, chip = null, dirty = false;
  function setDirty(on) {
    dirty = on; if (!saveBtn) return;
    if (on) saveBtn.removeAttribute("aria-disabled"); else saveBtn.setAttribute("aria-disabled", "true");
    saveBtn.classList.toggle("is-off", !on); chip.hidden = !on;
    window.onbeforeunload = on ? function (e) { e.preventDefault(); e.returnValue = ""; return ""; } : null;
  }
  BT.markClean = function () { setDirty(false); };
  function initDirty() {
    var bar = document.querySelector(".hs-top-actions"); if (!bar) return;
    saveBtn = [].find.call(bar.querySelectorAll("a.btn"), function (a) { return /^save/i.test(a.textContent.replace(/[✓\s]+/g, " ").trim()); });
    if (!saveBtn) return;
    chip = document.createElement("span"); chip.className = "bt-dirty"; chip.textContent = "Unsaved changes"; chip.hidden = true; saveBtn.parentNode.insertBefore(chip, saveBtn);
    setDirty(false);
    var main = document.querySelector(".hs-content");
    ["input", "change"].forEach(function (ev) { main.addEventListener(ev, function (e) { if (e.target.closest(".st-v, .bt-drawer, .pm-send, .rg-sel, .rg-switch, .tbl")) return; if (e.target.matches("input, select, textarea")) setDirty(true); }); });
  }
  /* ---- uploads ---- */
  var OK = /\.(jpe?g|png|webp)$/i, MAX = 10 * 1024 * 1024;
  function size(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; }
  function progress(bar, done) { var i = 0, t = setInterval(function () { i += 20; bar.style.width = Math.min(i, 100) + "%"; if (i >= 100) { clearInterval(t); done(); } }, 140); }
  function initUploads() {
    document.querySelectorAll("input[data-upload]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var kind = inp.getAttribute("data-upload"), host = inp.closest("label") || inp.parentNode;
        [].forEach.call(inp.files, function (file) {
          var bad = null;
          if (kind === "doc" ? !/\.(jpe?g|png|pdf)$/i.test(file.name) : !OK.test(file.name)) bad = file.name + " is not supported. Use " + (kind === "doc" ? "JPG, PNG or PDF." : "JPG, PNG or WebP.");
          else if (file.size > MAX) bad = file.name + " is over 10 MB. Choose a smaller file.";
          if (bad) { BT.toast(bad, { error: true }); if (kind === "doc") BT.setError(inp, bad); return; }
          if (kind === "doc") {
            BT.setError(inp, null); host.setAttribute("data-done", "0");
            host.querySelector(".bt-doc") && host.querySelector(".bt-doc").remove();
            var d = document.createElement("span"); d.className = "bt-doc"; d.innerHTML = '<b></b><span class="bt-prog"><i></i></span><em>Uploading…</em>';
            d.querySelector("b").textContent = file.name + " · " + size(file.size); host.appendChild(d);
            progress(d.querySelector("i"), function () {
              if (BT.fail) { d.querySelector("em").textContent = "Upload failed."; d.querySelector("em").className = "bt-bad-txt"; var r = document.createElement("button"); r.type = "button"; r.className = "bt-link"; r.textContent = "Retry"; r.onclick = function (ev) { ev.preventDefault(); ev.stopPropagation(); BT.fail = false; inp.dispatchEvent(new Event("change")); }; d.appendChild(r); return; }
              host.setAttribute("data-done", "1"); d.querySelector(".bt-prog").remove(); d.querySelector("em").textContent = "Uploaded";
              var x = document.createElement("button"); x.type = "button"; x.className = "bt-link"; x.textContent = "Remove"; x.onclick = function (ev) { ev.preventDefault(); ev.stopPropagation(); d.remove(); host.setAttribute("data-done", "0"); inp.value = ""; }; d.appendChild(x);
            });
          } else {
            var th = document.createElement("div"); th.className = "bt-thumb";
            var im = document.createElement("img"); im.alt = file.name; im.src = URL.createObjectURL(file);
            th.appendChild(im); th.innerHTML += '<button type="button" class="bt-x2" aria-label="Remove ' + file.name.replace(/"/g, "") + '">&times;</button><span class="bt-prog"><i></i></span>';
            host.parentNode.insertBefore(th, host);
            progress(th.querySelector("i"), function () { th.querySelector(".bt-prog").remove(); });
            th.querySelector(".bt-x2").onclick = function () { var nx = th.nextSibling; var par = th.parentNode; par.removeChild(th); BT.toast("Photo removed.", { action: "Undo", fn: function () { par.insertBefore(th, nx); } }); };
          }
        });
        if (kind === "photos") inp.value = "";
      });
    });
  }
  /* ---- empty states ---- */
  BT.empty = function (el, title, text, cta, href) {
    var d = document.createElement("div"); d.className = "bt-empty";
    d.innerHTML = '<div class="bt-empty-ic" aria-hidden="true">&#9675;</div><h3></h3><p></p>' + (cta ? '<a class="btn btn-secondary btn-md" href="' + href + '"></a>' : "");
    d.querySelector("h3").textContent = title; d.querySelector("p").textContent = text; if (cta) d.querySelector("a").textContent = cta;
    el.parentNode.replaceChild(d, el); return d;
  };
  var EMPTY = {
    g21: [".sv-grid", "Nothing saved yet", "Tap the heart on any stay to keep it here for later.", "Find stays", "belongo-g03-search-results.html"],
    p03: [".pl-grid", "No listings yet", "Add your first property. Belongo checks it before it goes live.", "Add property", "belongo-p04-add-property.html"],
    a07: [".pt-q", "No open applications", "New Local Curator applications appear here for review.", null],
    a09: [".rg-t2", "No suggestions this week", "Guests who meet an automatic rule appear here for you to approve.", null]
  };
  function initEmpty() {
    var m = location.pathname.match(/belongo-([ghap]\d\d)-/), c = m && EMPTY[m[1]];
    if (c && Q.get("empty") === "1") { var t = document.querySelector(c[0]); if (t) { if (m[1] === "a07" || m[1] === "a09") { var hd = t.previousElementSibling; } BT.empty(t, c[1], c[2], c[3], c[4]); } }
    var s = document.querySelector('input[type="search"]'), rows = document.querySelectorAll(".bk-row.r");
    if (s && rows.length) {
      var tableHost = rows[0].parentNode, note = null;
      s.addEventListener("input", function () {
        var q = s.value.trim().toLowerCase(), shown = 0;
        rows.forEach(function (r) { var hit = !q || r.textContent.toLowerCase().indexOf(q) > -1; r.style.display = hit ? "" : "none"; if (hit) shown++; });
        if (note) { note.remove(); note = null; }
        if (!shown) { note = document.createElement("div"); note.className = "bt-empty"; note.innerHTML = '<div class="bt-empty-ic" aria-hidden="true">&#9675;</div><h3>No bookings match</h3><p></p><button type="button" class="btn btn-secondary btn-md">Clear search</button>'; note.querySelector("p").textContent = "Nothing matches “" + s.value.trim() + "”. Check the spelling, or try a guest name, property or reference."; note.querySelector("button").onclick = function () { s.value = ""; s.dispatchEvent(new Event("input")); s.focus(); }; tableHost.appendChild(note); }
      });
    }
    if (Q.get("msg") === "submitted") BT.toast("Listing submitted. Belongo reviews it, usually within 24 hours.");
  }
  function boot() { initDirty(); initUploads(); initEmpty(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();

/* ============================================================
   GUEST SESSION + TRIP (design demo)
   - Signed-out is the default. Signing in (g07) sets the session.
   - Recognition perks, saved-card checkout and the account pages
     assume a signed-in guest; signed-out visitors see the plain
     versions and are sent to sign in for account pages.
   - The trip (city, dates, guests) chosen on the landing page is
     carried to search, property, checkout and confirmation.
   Demo shortcuts: ?signed=in or ?signed=out sets the session.
   ============================================================ */
(function () {
  "use strict";
  var m = location.pathname.match(/belongo-(g\d\d)-/); if (!m) return;
  var PID = m[1], BT = window.BT = window.BT || {};
  var Qs = new URLSearchParams(location.search);
  try { if (Qs.get("signed") === "in") sessionStorage.setItem("belongo.in", "1"); if (Qs.get("signed") === "out") sessionStorage.removeItem("belongo.in"); } catch (e) {}
  BT.signedIn = function () { try { return sessionStorage.getItem("belongo.in") === "1"; } catch (e) { return false; } };
  BT.signIn = function () { try { sessionStorage.setItem("belongo.in", "1"); } catch (e) {} };
  BT.signOut = function () { try { sessionStorage.removeItem("belongo.in"); } catch (e) {} };
  var ACCOUNT = { g08: 1, g09: 1, g10: 1, g11: 1, g12: 1, g13: 1, g23: 1 };
  var inn = BT.signedIn();
  if (ACCOUNT[PID] && !inn) { location.replace("belongo-g07-auth.html?next=" + encodeURIComponent(location.pathname.split("/").pop())); return; }
  /* ---- trip ---- */
  var DEF = { city: "Dubai, UAE", inD: "2026-09-12", outD: "2026-09-15", guests: "2 adults · 1 room" };
  BT.trip = function () { try { var t = JSON.parse(sessionStorage.getItem("belongo.trip")); if (t && t.inD) return t; } catch (e) {} return DEF; };
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function pd(s) { var a = s.split("-"); return new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); }
  function dm(d) { return d.getUTCDate() + " " + MON[d.getUTCMonth()]; }
  function shift(d, n) { return new Date(d.getTime() + n * 86400000); }
  function f0(n) { return Math.round(n).toLocaleString("en-US"); }
  function f2(n) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  var T = BT.trip(), isDef = T.inD === DEF.inD && T.outD === DEF.outD && T.guests === DEF.guests;
  var I = pd(T.inD), O = pd(T.outD), N = Math.max(1, Math.round((O - I) / 86400000));
  var total = 268 * N + 148, sub = 268 * N, dep = Math.round(total * 0.25), bal = total - dep, factor = total / 952;
  BT.totals = { total: total, dep: dep };
  var guestsA = T.guests.split(" · ")[0];
  function rng(sp) { var same = I.getUTCMonth() === O.getUTCMonth(); return same ? I.getUTCDate() + (sp ? " – " : "–") + O.getUTCDate() + " " + MON[I.getUTCMonth()] : dm(I) + (sp ? " – " : "–") + dm(O); }
  var nightsTxt = N + (N === 1 ? " night" : " nights");
  var cancelD = shift(I, -2), balD = shift(I, -7);
  var RULES = [
    [/AED 268 × 3 nights/, function () { return "AED 268 × " + nightsTxt; }],
    [/AED 804\.00/, function () { return "AED " + f2(sub); }],
    [/AED 952\.00/, function () { return "AED " + f2(total); }],
    [/AED 952/, function () { return "AED " + f0(total); }],
    [/AED 238/, function () { return "AED " + f0(dep); }],
    [/AED 714/, function () { return "AED " + f0(bal); }],
    [/AED 1,134/, function () { return "AED " + f0(total / 0.84); }],
    [/AED 956/, function () { return "AED " + f0(sub / 0.84); }],
    [/12 – 15 Sep/, function () { return rng(true); }],
    [/12–15 Sep/, function () { return rng(false); }],
    [/Sat, 12 Sep/, function () { return WD[I.getUTCDay()] + ", " + dm(I); }],
    [/Tue, 15 Sep/, function () { return WD[O.getUTCDay()] + ", " + dm(O); }],
    [/Sep 10(?=, 18:00)/, function () { return MON[cancelD.getUTCMonth()] + " " + cancelD.getUTCDate(); }],
    [/3 nights/, function () { return nightsTxt; }],
    [/2 adults · 1 room/, function () { return T.guests; }],
    [/2 adults/, function () { return guestsA; }],
    [/\b5 Sep\b/, function () { return dm(balD); }],
    [/\b10 Sep\b/, function () { return dm(cancelD); }],
    [/see you in Dubai/, function () { return "see you in " + T.city.split(",")[0]; }]
  ];
  var BIG = new RegExp(RULES.map(function (r) { return "(" + r[0].source + ")"; }).join("|"), "g");
  function applyTrip(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) { var p = n.parentNode; if (p && /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) continue; nodes.push(n); }
    nodes.forEach(function (node) {
      var t = node.nodeValue; if (!/AED|nights|adults|Sep|Dubai/.test(t)) return;
      var out = t.replace(BIG, function () { var args = arguments; for (var i = 0; i < RULES.length; i++) { if (args[i + 1] !== undefined) return RULES[i][1](); } return args[0]; });
      if (out !== t) node.nodeValue = out;
    });
  }
  var TRIP_PAGES = { g04: 1, g05: 1, g06: 1 };
  if (TRIP_PAGES[PID] && !isDef) document.addEventListener("DOMContentLoaded", function () { applyTrip(document.body); });
  if (PID === "g03") document.addEventListener("DOMContentLoaded", function () {
    var city = Qs.get("where") || T.city;
    if (!isDef) {
      document.querySelectorAll(".sr-seg b").forEach(function (b, i) { var t = b.textContent; if (i === 1) b.textContent = rng(false); else if (i === 2) b.textContent = T.guests; });
      document.querySelectorAll(".sr-total, .deal-was").forEach(function (e) { e.textContent = e.textContent.replace(/AED ([\d,]+)/, function (x, v) { return "AED " + f0(parseInt(v.replace(/,/g, ""), 10) * factor); }); });
      document.querySelectorAll(".sr-total-note, .sr-sub, .sr-meta").forEach(function (e) { e.textContent = e.textContent.replace(/3 nights/, nightsTxt); });
      var main = document.querySelector(".sr-card"); if (main) { document.querySelectorAll(".sr-total-note").forEach(function (e) { e.textContent = e.textContent.replace(/\d+ nights?/, nightsTxt); }); }
    }
    if (!/^Dubai/i.test(city)) {
      var first = document.querySelector(".sr-card"); if (first && first.parentNode) { var nt = document.createElement("div"); nt.className = "bt-note"; nt.innerHTML = "<b>Prototype note:</b> every city shows the same sample stays from Dubai. In the real product, results follow the search."; first.parentNode.insertBefore(nt, first); }
    }
  });
  /* ---- signed-in / signed-out presentation ---- */
  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add(inn ? "is-in" : "is-out");
    if (inn) {
      document.querySelectorAll('.site-actions a.btn[href*="g07-auth"]').forEach(function (a) {
        var u = document.createElement("a"); u.className = "site-user"; u.href = "belongo-g08-my-bookings.html"; u.innerHTML = '<span class="av">MN</span><span class="nm">Mariam</span>'; a.parentNode.replaceChild(u, a);
      });
      document.querySelectorAll('.site-mobile-actions a.btn[href*="g07-auth"]').forEach(function (a) { a.textContent = "My bookings"; a.setAttribute("href", "belongo-g08-my-bookings.html"); });
      var cta = document.querySelector('a[href*="g07-auth.html?from=booking"]'); if (cta) { cta.textContent = "Go to my bookings"; cta.setAttribute("href", "belongo-g08-my-bookings.html"); }
    } else {
      document.querySelectorAll(".sr-chip").forEach(function (c) { if (/Ambassador benefits/.test(c.textContent)) c.style.display = "none"; });
    }
    document.querySelectorAll(".acct-signout a").forEach(function (a) { a.addEventListener("click", function () { BT.signOut(); }); });
    if (PID === "g05" && !inn) {
      var wanted = { "First name": 1, "Last name": 1, "Email": 1, "Mobile": 1, "Name on card": 1 };
      document.querySelectorAll(".co-field").forEach(function (f) { var l = f.querySelector(".co-label"), i = f.querySelector("input"); if (!l || !i) return; var key = l.textContent.trim().replace(/ —.*$/, "").replace(/ \(.*$/, ""); if (wanted[key]) { i.value = ""; if (key === "Email") i.placeholder = "you@example.com"; } });
      var sec = document.querySelector(".co-sec"); if (sec) { var b = document.createElement("div"); b.className = "bt-soft"; b.innerHTML = 'Booking as a guest. <a href="belongo-g07-auth.html?next=belongo-g05-checkout.html">Sign in</a> for faster checkout and member benefits.'; sec.parentNode.insertBefore(b, sec); }
    }
  });
})();
