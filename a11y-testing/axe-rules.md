---
title: "List of axe 4.10 rules | Deque University | Deque Systems"
source: "https://dequeuniversity.com/rules/axe/4.10?lang=en"
author:
published:
created: 2025-09-24
description:
tags:
  - "clippings"
---
## List of Axe HTML 4.10 rules

These are automated accessibility checks. Manual checks are also required. Learn how through our [accessibility curriculum /dequeuniversity.com/online-courses/).

**[See the list of axe html versions /dequeuniversity.com/rules/axe/rules/axe/html)**

- [WCAG 2.0 Level A & AA Rules /dequeuniversity.com/rules/axe/4.10/#wcag-20-level-a--aa-rules)
- [WCAG 2.1 Level A & AA Rules /dequeuniversity.com/rules/axe/4.10/#wcag-21-level-a--aa-rules)
- [WCAG 2.2 Level A & AA Rules /dequeuniversity.com/rules/axe/4.10/#wcag-22-level-a--aa-rules)
- [Best Practices Rules /dequeuniversity.com/rules/axe/4.10/#best-practices-rules)
- [WCAG 2.x level AAA rules /dequeuniversity.com/rules/axe/4.10/#wcag-2x-level-aaa-rules)
- [Experimental Rules /dequeuniversity.com/rules/axe/4.10/#experimental-rules)
- [Deprecated Rules /dequeuniversity.com/rules/axe/4.10/#deprecated-rules)

## WCAG 2.0 Level A & AA Rules

Ensure <area> elements of image maps have alternate text 

### aria-allowed-attr 
 
Ensure an element's role supports its ARIA attributes 
 
### aria-braille-equivalent 
 Ensure aria-braillelabel and aria-brailleroledescription have a non-braille equivalent 
 
### aria-command-name 
 Ensure every ARIA button, link and menuitem has an accessible name 
 
### aria-conditional-attr 
 Ensure ARIA attributes are used as described in the specification of the element's role 
 
### aria-deprecated-role 
Ensure elements do not use deprecated roles

### aria-hidden-body 
Ensure aria-hidden="true" is not present on the document body. 

### aria-hidden-focus 
 Ensure aria-hidden elements are not focusable nor contain focusable elements 
 
### aria-input-field-name 
 Ensure every ARIA input field has an accessible name 
 
### aria-meter-name 
 Ensure every ARIA meter node has an accessible -name 
 Ensure every ARIA button, link and menuitem has an accessible name 
 
### aria-conditional-attr 
 Ensure ARIA attributes are used as described in the specification of the element's role 
 
### aria-deprecated-role 
Ensure elements do not use deprecated roles

### aria-hidden-body 
 Ensure aria-hidden="true" is not present on the document body. 
 
### aria-hidden-focus 
 Ensure aria-hidden elements are not focusable nor contain focusable elements 
 
### aria-input-field-name 
 Ensure every ARIA input field has an accessible name 
 
### aria-meter-name 
 Ensure every ARIA meter node has an accessible name 
 
### aria-progressbar-name 
 Ensure every ARIA progressbar node has an accessible name 
 
### aria-prohibited-attr 
 Ensure ARIA attributes are not prohibited for an element's role 
 
### aria-required-attr 
 Ensure elements with ARIA roles have all required ARIA attributes 
 
### aria-required-children 
 Ensure elements with an ARIA role that require child roles contain them 
 
### aria-required-parent 
 Ensure elements with an ARIA role that require parent roles are contained by them 
 
### aria-roles 
 Ensure all elements with a role attribute use a valid value 
 
### aria-toggle-field-name 
 Ensure every ARIA toggle field has an accessible name 
 
### aria-tooltip-name 
 Ensure every ARIA tooltip node has an accessible name 
 
### aria-valid-attr-value 
Ensure all ARIA attributes have valid values
 
### aria-valid-attr 

 Ensure attributes that begin with aria- are valid ARIA attributes 
 
### blink 
Ensure <blink> elements are not used
  
### button-name 
Ensure buttons have discernible text

### target-size

Ensure touch targets have sufficient size and space


## Best Practices Rules

Rules that do not necessarily conform to WCAG success criterion but are industry accepted practices that improve the user experience.

### accesskeys

Ensure every accesskey attribute value is unique

### aria-allowed-role

Ensure role attribute has an appropriate value for the element

### aria-dialog-name

Ensure every ARIA dialog and alertdialog node has an accessible name

### aria-text

Ensure role="text" is used on elements with no focusable descendants

### aria-treeitem-name

Ensure every ARIA treeitem node has an accessible name

### empty-heading

Ensure headings have discernible text

### empty-table-header

Ensure table headers have discernible text 

### frame-tested

Ensure <iframe> and <frame> elements contain the axe-core script

### heading-order

Ensure the order of headings is semantically correct

### image-redundant-alt

Ensure image alternative is not repeated as text 

### label-title-only

Ensure that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes 

### landmark-banner-is-top-level

Ensure the banner landmark is at top level 

### landmark-complementary-is-top-level

Ensure the complementary landmark or aside is at top level

### landmark-contentinfo-is-top-level

Ensure the contentinfo landmark is at top level 

### landmark-main-is-top-level

Ensure the main landmark is at top level 

### landmark-no-duplicate-banner

Ensure the document has at most one banner landmark

### landmark-no-duplicate-contentinfo

Ensure the document has at most one contentinfo landmark

### landmark-no-duplicate-main

Ensure the document has at most one main landmark 

### landmark-one-main

Ensure the document has a main landmark 

### landmark-unique

Ensure landmarks are unique

### meta-viewport-large

Ensure <meta name="viewport"> can scale a significant amount 

### page-has-heading-one

Ensure that the page, or at least one of its frames contains a level-one heading 

### presentation-role-conflict

Elements marked as presentational should not have global ARIA or tabindex to ensure all screen readers ignore them 

### region

Ensure all page content is contained by landmarks 

### scope-attr-valid

Ensure the scope attribute is used correctly on tables 

### skip-link

Ensure all skip links have a focusable target 

### tabindex 

Ensure tabindex attribute values are not greater than 0

### table-duplicate-name
/dequeuniversity.com/rules/axe/4.10/table-duplicate-name) | 
Ensure the <caption> element does not contain the same text as the summary attribute
  | Minor | best-practice | failure, needs review |  |

## WCAG 2.x level AAA rules

Rules that check for conformance to WCAG AAA success criteria that can be fully automated. These are disabled by default in axe-core.

### color-contrast-enhanced
/dequeuniversity.com/rules/axe/4.10/color-contrast-enhanced) | 
Ensure the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds
| Serious | cat.color, wcag2aaa, wcag146, ACT | failure, needs review | [09o5cg /act-rules.github.io/rules/09o5cg) |
| --- | --- | --- | --- | --- | --- |
### identical-links-same-purpose
/dequeuniversity.com/rules/axe/4.10/identical-links-same-purpose) | 
Ensure that links with the same accessible name serve a similar purpose
| Minor | cat.semantics, wcag2aaa, wcag249 | needs review | [b20e66 /act-rules.github.io/rules/b20e66) |
### meta-refresh-no-exceptions
/dequeuniversity.com/rules/axe/4.10/meta-refresh-no-exceptions) | 
Ensure <meta http-equiv="refresh"> is not used for delayed refresh
| Minor | cat.time-and-media, wcag2aaa, wcag224, wcag325 | failure | [bisz58 /act-rules.github.io/rules/bisz58) |

## Experimental Rules

Rules we are still testing and developing. They are disabled by default in axe-core, but are enabled for the axe browser extensions.

### css-orientation-lock
/dequeuniversity.com/rules/axe/4.10/css-orientation-lock) | 
Ensure content is not locked to any specific display orientation, and the content is operable in all display orientations 
| Serious | cat.structure, wcag134, wcag21aa, EN-9.1.3.4, experimental | failure, needs review | [b33eff /act-rules.github.io/rules/b33eff) |
| --- | --- | --- | --- | --- | --- |
### focus-order-semantics
/dequeuniversity.com/rules/axe/4.10/focus-order-semantics) | 
Ensure elements in the focus order have a role appropriate for interactive content 
| Minor | cat.keyboard, best-practice, experimental | failure |  |
### hidden-content
/dequeuniversity.com/rules/axe/4.10/hidden-content) | 
Informs users about hidden content.
| Minor | cat.structure, best-practice, experimental, review-item | failure, needs review |  |
### label-content-name-mismatch
/dequeuniversity.com/rules/axe/4.10/label-content-name-mismatch) | 
Ensure that elements labelled through their content must have their visible text as part of their accessible name
| Serious | cat.semantics, wcag21a, wcag253, EN-9.2.5.3, experimental | failure | [2ee8b8 /act-rules.github.io/rules/2ee8b8) |
### p-as-heading
/dequeuniversity.com/rules/axe/4.10/p-as-heading) | 
Ensure bold, italic text and font-size is not used to style <p> elements as a heading 
  | Serious | cat.semantics, wcag131, EN-9.1.3.1, experimental | failure, needs review |  |
### table-fake-caption
/dequeuniversity.com/rules/axe/4.10/table-fake-caption) | 
Ensure that tables with a caption use the <caption> element.
  | Serious | experimental, wcag131, section508, section508.22.g, EN-9.1.3.1 | failure |  |
### td-has-header
/dequeuniversity.com/rules/axe/4.10/td-has-header) | 
Ensure that each non-empty data cell in a <table> larger than 3 by 3 has one or more table headers
  | Critical | experimental, wcag131, section508, section508.22.g, TT14.b, EN-9.1.3.1 | failure |  |

## Deprecated Rules

Deprecated rules are disabled by default and will be removed in the next major release.

### aria-roledescription
/dequeuniversity.com/rules/axe/4.10/aria-roledescription) | 
Ensure aria-roledescription is only used on elements with an implicit or explicit role 
| Serious | EN-9.4.1.2, deprecated | failure, needs review |  |
| --- | --- | --- | --- | --- | --- |
### audio-caption
/dequeuniversity.com/rules/axe/4.10/audio-caption) | 
Ensure <audio> elements have captions
  | Critical | cat.time-and-media, wcag121, EN-9.1.2.1, section508, section508.22.a, deprecated | needs review | [2eb176 /act-rules.github.io/rules/2eb176), [afb423 /act-rules.github.io/rules/afb423) |
### duplicate-id-active
/dequeuniversity.com/rules/axe/4.10/duplicate-id-active) | 
Ensure every id attribute value of active elements is unique
| Serious | cat.parsing, wcag2a-obsolete, wcag411, deprecated | failure ### 3ea0c8 /act-rules.github.io/rules/3ea0c8) |
### duplicate-id
/dequeuniversity.com/rules/axe/4.10/duplicate-id) | 
Ensure every id attribute value is unique
| Minor | cat.parsing, wcag2a-obsolete, wcag411, deprecated | failure | [3ea0c8 /act-rules.github.io/rules/3ea0c8) |

## Axe browser extensions

The axe features are integrated into the developer tools.

- [axe Chrome browser extension /chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US)
- [axe Firefox browser extension /addons.mozilla.org/en-US/firefox/addon/axe-devtools/)
- [axe Edge browser extension /microsoftedge.microsoft.com/addons/detail/axe-web-accessibility-t/kcenlimkmjjkdfcaleembgmldmnnlfkn)

## Contribute to axe on

- You can find the [axe-core source code on GitHub. /github.com/dequelabs/axe-core)
- See also the [axe-core changelog on GitHub /github.com/dequelabs/axe-core/blob/develop/CHANGELOG.md).

## Deque's Enterprise Suite of Accessibility Tools

- **[axe DevTools: /www.deque.com/axe/devtools/?__hstc=213731083.e79dcc1924e2974d304b581a69002d3b.1758669605465.1758669605465.1758669605465.1&__hssc=213731083.1.1758669605465&__hsfp=403688673)** Empower development teams to find, prevent, and fix accessibility issues while they code.
- **[axe Auditor: /www.deque.com/axe/auditor/?__hstc=213731083.e79dcc1924e2974d304b581a69002d3b.1758669605465.1758669605465.1758669605465.1&__hssc=213731083.1.1758669605465&__hsfp=403688673)** Bring efficient, full-coverage auditing capabilities to your testing teams with this step-by-step manual accessibility testing tool.
- **[axe Monitor: /www.deque.com/axe/monitor/?__hstc=213731083.e79dcc1924e2974d304b581a69002d3b.1758669605465.1758669605465.1758669605465.1&__hssc=213731083.1.1758669605465&__hsfp=403688673)** Dynamically scan, monitor and report on the accessibility status of your site across business and development teams.

## Learn Web Accessibility In-Depth

- [Subscribe to Deque University accessibility courses. /dequeuniversity.com/online-courses/)
- [Request enterprise training workshops at your location /dequeuniversity.com/curriculum/instructor-led/)