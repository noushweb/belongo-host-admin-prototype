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
 g23:[["What are the levels?","Circle, Verified, Ambassador and Elite. They reflect trust and contribution, never payment."],["How do I move up?","Strong reviews from hosts, referrals and nearby places help. Belongo reviews and grants each level."],["What do I get?","Hosts decide. Participating stays show gold labels such as Welcome Gift Included."]],
 h01:[["How much does hosting cost?","A flat commission from 12% of each booking, all in. No listing fees."],["How do I start?","Press Start listing and follow the six short steps."],["Who pays me and when?","Belongo pays out 48 hours after the guest checks in."]],
 h02:[["What do the cards show?","Occupancy, revenue and today's arrivals for your properties."],["How do I switch property?","Use the property switcher at the top of the sidebar."],["What needs my attention?","The tasks list shows messages and bookings that are waiting for you."]],
 h03:[["Is my progress saved?","Yes. It saves automatically and you can leave and return."],["How long does it take?","About ten minutes for a first listing."],["What happens when I finish?","Belongo reviews the listing, then it goes live."]],
 h04:[["How do I confirm a booking?","Open it and press Accept. Instant-book stays confirm by themselves."],["What do the statuses mean?","Pending is waiting for you, Confirmed is booked, Completed has been stayed."],["How do I contact a guest?","Open the booking and use Message guest."]],
 h05:[["How do I block dates?","Select the dates and choose Block. Guests cannot book them."],["What is a sync conflict?","Another calendar changed the same dates. You choose which one to keep."],["Can I set different prices by day?","Yes, in Pricing."]],
 h06:[["How do I add a property?","Press Add property and follow the steps."],["What is listing completeness?","A score for how complete each listing is. Higher scores rank better."],["How do I pause a listing?","Open it and choose Pause."]],
 h07:[["What is smart pricing?","Belongo adjusts your nightly rate within your range by demand and local events."],["Can I set my own rules?","Yes. Weekend, season, last-minute and length-of-stay rules are all optional."],["Where do I allow deposits?","Part-payment is controlled per listing. Guests only see it when you allow it."]],
 h08:[["How do I reply to a review?","Open it, write your reply and press Post. Replies are public."],["Can I remove a review?","Not unless it breaks our guidelines. You can report it."],["How does my rating count?","Your average rating affects ranking and your Preferred Host badge."]],
 h09:[["What can I record here?","Running costs such as cleaning, repairs and utilities."],["Can I attach receipts?","Yes, add a photo or file to each expense."],["Do expenses affect my payout?","No. They feed your profit and loss report."]],
 h10:[["How is profit calculated?","Revenue minus Belongo commission and your recorded expenses."],["Can I download this?","Yes, as PDF or Excel from the Export button."],["When are payouts sent?","48 hours after each guest checks in."]],
 h11:[["What are leases?","Long-stay tenants with a contract, dates and rent."],["How do renewals work?","You get a reminder before each lease ends."],["Can guests and tenants mix?","Yes. They are tracked separately."]],
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
