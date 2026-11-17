/* Home page: hero "who" picker and industry selector. */
(function () {
  'use strict';

  var INDUSTRIES = [
    {
      "name": "Real Estate & Property Investors",
      "diff": "Owning rental properties, flipping houses, or building a real estate portfolio comes with tax opportunities that many investors overlook. From depreciation strategies to property sales and investment structures, the right planning can make a meaningful difference.",
      "handle": [
        "Are you maximizing available depreciation benefits?",
        "Could your property sales trigger unexpected taxes?",
        "Is your investment structure working in your favor?"
      ],
      "href": "/industries/real-estate/"
    },
    {
      "name": "Construction & Contractors",
      "diff": "A busy construction schedule doesn’t always mean a profitable business. Job costs, labor, materials, equipment, and cash flow all matter. Understanding your numbers can change how you run your business.",
      "handle": [
        "Do you know the actual profitability of every project?",
        "Are rising material and labor costs eating into your margins?",
        "Are you making the most of available equipment tax strategies?"
      ],
      "href": "/industries/construction/"
    },
    {
      "name": "Creators, Influencers & Digital Businesses",
      "diff": "YouTube revenue, sponsorships, affiliate income, brand deals, and digital products can turn your online presence into a serious business. But multiple income streams bring tax responsibilities and planning opportunities you shouldn’t overlook.",
      "handle": [
        "Are you tracking all your income and legitimate business expenses?",
        "Is your current business structure still right for you?",
        "Could proactive tax planning help you keep more of what you earn?"
      ],
      "href": "/industries/creators/"
    },
    {
      "name": "Small Businesses & Entrepreneurs",
      "diff": "Building a business takes hard work. But growing revenue alone doesn’t guarantee financial success. The right tax strategy, business structure, and financial insight can help you make smarter decisions at every stage.",
      "handle": [
        "Is your business structured efficiently for tax purposes?",
        "Do you know where your money is actually going?",
        "Are you planning for taxes before the year ends?"
      ],
      "href": "/industries/small-business/"
    },
    {
      "name": "High-Income Individuals & Investors",
      "diff": "Multiple income sources, investments, business ownership, retirement accounts, and capital gains can create increasingly complex tax situations. A tax return tells you what happened. Proactive planning helps you prepare for what’s next.",
      "handle": [
        "Are you overlooking opportunities to manage your tax exposure?",
        "Are your investment and retirement decisions tax-efficient?",
        "Are you planning ahead for major financial events?"
      ],
      "href": "/industries/high-income/"
    },
    {
      "name": "Retail & E-Commerce",
      "diff": "Between inventory, shipping, platform fees, refunds, advertising, and sales tax, online selling can get complicated quickly. Understanding your true profitability is essential to growing a successful retail business.",
      "handle": [
        "Do you know your actual profit after all platform fees?",
        "Is your inventory and cost of goods sold properly tracked?",
        "Are you prepared for multi-state sales tax responsibilities?"
      ],
      "href": "/industries/retail/"
    },
    {
      "name": "Healthcare, Medical & Dental Practices",
      "diff": "Running a successful practice involves more than patient care. Equipment investments, employee costs, owner compensation, and business expansion all create important financial and tax decisions.",
      "handle": [
        "Is your practice operating as profitably as it could?",
        "Are equipment purchases being evaluated strategically?",
        "Is your business structure aligned with your long-term goals?"
      ],
      "href": "/industries/healthcare/"
    },
    {
      "name": "Manufacturing & Distribution",
      "diff": "Production costs, inventory, labor, overhead, and machinery investments all influence your bottom line. Better financial visibility can help you identify opportunities to improve margins and make smarter investment decisions.",
      "handle": [
        "Do you know the true cost and profitability of your products?",
        "Are inventory and production costs properly accounted for?",
        "Could your research or equipment investments create tax opportunities?"
      ],
      "href": "/industries/manufacturing/"
    },
    {
      "name": "Technology & Software Companies",
      "diff": "Software development, innovation, hiring, and rapid growth bring unique financial and tax considerations. Your business strategy should account for more than just the next product launch.",
      "handle": [
        "Are your development activities being evaluated for R&D tax credits?",
        "Are you accounting for software development costs appropriately?",
        "Is your financial structure ready to support growth?"
      ],
      "href": "/industries/technology/"
    },
    {
      "name": "Research & Development (R&D)",
      "diff": "Developing new products, improving processes, and solving technical challenges may create valuable tax opportunities. Many businesses don’t realize that qualifying research activities can extend beyond traditional laboratories.",
      "handle": [
        "Could your product development activities qualify?",
        "Are you identifying and documenting eligible research expenses?",
        "Are you overlooking federal or state R&D tax credits?"
      ],
      "href": "/industries/research-development/"
    },
    {
      "name": "Transportation & Trucking",
      "diff": "Fuel, maintenance, insurance, equipment financing, and driver expenses can quickly affect trucking profitability. Understanding your operating costs and tax obligations helps keep your business moving in the right direction.",
      "handle": [
        "Do you know your true cost per mile?",
        "Are you evaluating equipment purchases strategically?",
        "Are your business expenses and tax deductions properly managed?"
      ],
      "href": "/industries/trucking/"
    },
    {
      "name": "Professional Services",
      "diff": "Consulting firms, law practices, agencies, and other professional businesses often have different financial needs as they grow. Managing overhead, owner compensation, profitability, and taxes requires thoughtful planning.",
      "handle": [
        "Is your business structure still the right fit?",
        "Are you managing overhead and owner compensation effectively?",
        "Are you turning revenue into sustainable profitability?"
      ],
      "href": "/industries/professional-services/"
    },
    {
      "name": "Restaurants & Hospitality",
      "diff": "Food costs, labor, inventory, payroll, tips, and operating expenses can quietly eat into restaurant profits. Understanding the numbers behind your operation is just as important as serving great food.",
      "handle": [
        "Are food and labor costs affecting your margins?",
        "Do you understand where your restaurant is losing money?",
        "Are payroll, tips, and sales tax being handled properly?"
      ],
      "href": "/industries/restaurants/"
    },
    {
      "name": "Agriculture & Farming",
      "diff": "Farm income, equipment purchases, operating costs, commodity prices, and seasonal cash flow make agricultural businesses unique. Planning ahead can help you prepare for both profitable years and challenging seasons.",
      "handle": [
        "Are equipment purchases being evaluated for tax benefits?",
        "Are you prepared for fluctuations in farm income?",
        "Are you planning for long-term farm ownership and succession?"
      ],
      "href": "/industries/agriculture/"
    },
    {
      "name": "Salons, Spas & Beauty Professionals",
      "diff": "Between booth rentals, commissions, product sales, supplies, payroll, and operating costs, running a beauty business involves more financial decisions than many owners realize.",
      "handle": [
        "Are booth rentals and contractor arrangements structured properly?",
        "Do you understand your actual profit after operating expenses?",
        "Could a different business structure make sense as you grow?"
      ],
      "href": "/industries/wellness/"
    }
  ];

  function initHeroChoice() {
    var group = document.querySelector('[role="radiogroup"]');
    var cont = document.querySelector('[data-hero-continue]');
    if (!group) return;
    var radios = Array.prototype.slice.call(group.querySelectorAll('[role="radio"]'));
    var current = 0;
    function select(i, focus) {
      current = i;
      radios.forEach(function (r, j) {
        var on = i === j;
        r.setAttribute('aria-checked', String(on));
        r.classList.toggle('on', on);
        r.tabIndex = on ? 0 : -1;
      });
      if (focus) radios[i].focus();
      // Carry the choice into the booking flow so step 1 is pre-filled.
      if (cont) cont.setAttribute('href', '/book/?who=' + i);
    }
    radios.forEach(function (r, i) {
      r.addEventListener('click', function () { select(i, false); });
      r.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); select((current + 1) % radios.length, true); }
        if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); select((current - 1 + radios.length) % radios.length, true); }
      });
    });
    select(0, false);
  }

  function initIndustries() {
    var panel = document.querySelector('[data-ind-panel]');
    if (!panel) return;
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.ibtn'));
    var nameEl = panel.querySelector('[data-ind-name]');
    var diffEl = panel.querySelector('[data-ind-diff]');
    var listEl = panel.querySelector('[data-ind-handle]');
    var linkEl = panel.querySelector('[data-ind-href]');
    var rowStyle = listEl.firstElementChild ? listEl.firstElementChild.getAttribute('style') : '';
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var d = INDUSTRIES[i];
        if (!d) return;
        buttons.forEach(function (o, j) {
          o.classList.toggle('on', i === j);
          o.setAttribute('aria-pressed', String(i === j));
        });
        nameEl.textContent = d.name;
        diffEl.textContent = d.diff;
        listEl.textContent = '';
        d.handle.forEach(function (h) {
          var row = document.createElement('div');
          row.setAttribute('style', rowStyle);
          row.textContent = h;
          listEl.appendChild(row);
        });
        linkEl.setAttribute('href', d.href);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroChoice();
    initIndustries();
  });
})();
