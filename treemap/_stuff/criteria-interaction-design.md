# Interaction Design Success Criteria from HTML, CSS, and ARIA

Based on the WCAG 2.2 Quick Reference document, here are the success criteria and techniques specifically tagged for "interaction design":

## 1. Perceivable

### 1.1 Text Alternatives
- **1.1.1 Non-text Content (Level A)**
  - Providing accessible alternatives for buttons and interactive elements
  - Handling captchas accessibly
  - Making carousels accessible

### 1.2 Time-based Media
- **1.2.1 Audio-only and Video-only (Prerecorded) (Level A)**
  - Making audio and video controls accessible
  - Supporting keyboard access to media controls

- **1.2.2 Captions (Prerecorded) (Level A)**
  - Providing accessible video player controls

- **1.2.3 Audio Description or Media Alternative (Prerecorded) (Level A)**
  - Implementing accessible video controls

- **1.2.4 Captions (Live) (Level AA)**
  - Providing accessible controls for live media
  - Supporting streaming content accessibility

- **1.2.5 Audio Description (Prerecorded) (Level AA)**
  - Ensuring audio description controls are accessible
  - Supporting streaming content with audio descriptions

- **1.2.6 Sign Language (Prerecorded) (Level AAA)**
  - Providing accessible controls for sign language content

- **1.2.7 Extended Audio Description (Prerecorded) (Level AAA)**
  - Ensuring extended audio description controls work with assistive technologies

### 1.3 Adaptable
- **1.3.1 Info and Relationships (Level A)**
  - Creating accessible form controls
  - Designing modals that maintain relationships
  - Implementing accessible navigation patterns
  - Ensuring carousels maintain structural relationships
  - Providing accessible error handling
  - Designing skip-to-content mechanisms

- **1.3.2 Meaningful Sequence (Level A)**
  - Ensuring logical tab order
  - Creating accessible carousels
  - Making forms navigate in a logical sequence
  - Implementing focus management for interactive components

### 1.4 Distinguishable
- **1.4.10 Reflow (Level AA)**
  - Designing responsive interfaces that reflow properly
  - Creating mobile-friendly interaction patterns

- **1.4.13 Content on Hover or Focus (Level AA)**
  - Designing accessible tooltips and hover content
  - Managing focus appropriately

## 2. Operable

### 2.1 Keyboard Accessible
- **2.1.1 Keyboard (Level A)**
  - Ensuring all interactions work with keyboard
  - Making carousels keyboard accessible
  - Creating accessible form controls and navigation
  - Supporting tab ordering and focus management

- **2.1.2 No Keyboard Trap (Level A)**
  - Preventing focus traps in interactive components
  - Designing modals with proper keyboard access

- **2.1.4 Character Key Shortcuts (Level A)**
  - Providing mechanisms to disable or remap single-key shortcuts

### 2.2 Enough Time
- **2.2.1 Timing Adjustable (Level A)**
  - Making timeout controls accessible
  - Providing mechanisms to extend time limits

- **2.2.2 Pause, Stop, Hide (Level A)**
  - Providing controls for moving, auto-updating content
  - Creating pause mechanisms for carousels

- **2.2.6 Timeouts (Level AAA)**
  - Providing warning for timeouts
  - Creating mechanisms to manage session timeouts

### 2.3 Seizures and Physical Reactions
- **2.3.3 Animation from Interactions (Level AAA)**
  - Creating controls to disable motion animations

### 2.4 Navigable
- **2.4.3 Focus Order (Level A)**
  - Creating logical focus order in interfaces
  - Designing accessible tab order
  - Managing focus in modals and dynamic content

- **2.4.4 Link Purpose (In Context) (Level A)**
  - Designing buttons with clear purpose
  - Creating descriptive navigation elements

- **2.4.5 Multiple Ways (Level AA)**
  - Providing multiple navigation mechanisms

- **2.4.7 Focus Visible (Level AA)**
  - Ensuring visible focus indicators
  - Designing clear focus states for interactive elements

- **2.4.11 Focus Not Obscured (Minimum) (Level AA)**
  - Ensuring focus indicators aren't hidden
  - Managing sticky headers and footers

- **2.4.12 Focus Not Obscured (Enhanced) (Level AAA)**
  - Ensuring focus indicators are never hidden

- **2.4.13 Focus Appearance (Level AAA)**
  - Creating highly visible focus indicators

### 2.5 Input Modalities
- **2.5.1 Pointer Gestures (Level A)**
  - Providing alternatives to complex gestures
  - Supporting single-pointer interaction

- **2.5.2 Pointer Cancellation (Level A)**
  - Allowing users to cancel pointer actions
  - Making drag and drop accessible

- **2.5.3 Label in Name (Level A)**
  - Ensuring visible labels match programmatic names
  - Creating consistent button and control labeling

- **2.5.4 Motion Actuation (Level A)**
  - Providing alternatives to motion-activated features

- **2.5.5 Target Size (Enhanced) (Level AAA)**
  - Creating sufficiently large touch targets

- **2.5.6 Concurrent Input Mechanisms (Level AAA)**
  - Supporting multiple input methods simultaneously

- **2.5.7 Dragging Movements (Level AA)**
  - Providing alternatives to drag operations

- **2.5.8 Target Size (Minimum) (Level AA)**
  - Ensuring minimum target sizes for interactive elements

## 3. Understandable

### 3.2 Predictable
- **3.2.1 On Focus (Level A)**
  - Managing focus behavior predictably
  - Avoiding unexpected context changes

- **3.2.2 On Input (Level A)**
  - Creating predictable form interactions
  - Avoiding unexpected changes when users interact

- **3.2.5 Change on Request (Level AAA)**
  - Ensuring changes happen only when requested by users

- **3.2.6 Consistent Help (Level A)**
  - Creating consistently located help mechanisms

### 3.3 Input Assistance
- **3.3.1 Error Identification (Level A)**
  - Designing accessible error messages
  - Creating clear form validation

- **3.3.2 Labels or Instructions (Level A)**
  - Providing clear instructions for interactive elements
  - Designing accessible form controls

- **3.3.3 Error Suggestion (Level AA)**
  - Creating helpful error suggestions

- **3.3.4 Error Prevention (Level AA)**
  - Designing mechanisms to review before submission
  - Creating confirmation steps

- **3.3.7 Redundant Entry (Level A)**
  - Minimizing repetitive data entry in forms

- **3.3.8 Accessible Authentication (Minimum) (Level AA)**
  - Creating accessible login mechanisms
  - Supporting password managers

- **3.3.9 Accessible Authentication (Enhanced) (Level AAA)**
  - Providing enhanced accessible authentication options

## 4. Robust

### 4.1 Compatible
- **4.1.2 Name, Role, Value (Level A)**
  - Ensuring proper accessibility properties for custom controls

- **4.1.3 Status Messages (Level AA)**
  - Designing accessible status notifications
  - Creating ARIA live regions for dynamic content

This comprehensive list covers the interaction design-related success criteria from WCAG 2.2. Interaction designers should consider these requirements to create interfaces that are accessible to all users, including those who rely on assistive technologies.