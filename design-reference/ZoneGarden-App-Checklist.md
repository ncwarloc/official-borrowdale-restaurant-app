# Zone Garden App — Build Checklist

Use this alongside `ZoneGarden-App-Flow.mermaid` (the diagram) to track progress.
Check items off as we complete them.

---

## 1. Branding & Design System
- [x] Real logo integrated (badge image, embedded)
- [x] Color system from logo (Primary Green #138A36, Dark Green #0E5F2A, Gold #D8A12B, Ivory bg, Charcoal text)
- [x] Light mode glass cards (white, 15–20% opacity)
- [x] Dark mode palette (#111111 bg, #1B1B1B cards, #22B455 green, #E0B84A gold)
- [x] Typography → Inter, bold headings, gold price tags
- [x] Liquid Glass styling (blur, layered shadow, glossy sheen) on all cards
- [x] Primary button (green pill, white text, glow) / Secondary button (glass, green outline)
- [x] Rounded corners standardized (24–30px)

## 2. Splash & Auth
- [x] Splash: logo shatters into pieces on launch, reassembles, glows, fades to app
- [x] Login screen
- [x] Sign Up screen (name, email, phone, password, promo opt-in)
- [x] Forgot Password flow
- [x] Continue as Guest

## 3. Home Screen
- [x] Full-bleed hero slideshow with slow zoom (Ken Burns) animation
- [x] "Experience Luxury Dining in Borrowdale" welcome overlay
- [x] Glowing Order Now button
- [x] Quick-access category chips
- [x] Today's Specials row
- [x] Most Popular row
- [x] New Arrivals row
- [x] Chef's Recommendation card
- [x] Current promotion banner

## 4. Menu & Categories
- [x] Real menu data from PDF (67 items, 10 real categories)
- [x] Category grid (Menu tab)
- [x] Category item list screen
- [x] Quick add-to-cart button on menu cards
- [ ] **Real photos for every dish** ← in progress, you're supplying the rest
- [x] Real photos wired for category cards
- [ ] Confirm/correct traditional-dish descriptions with the kitchen
- [ ] Confirm Side Dish pricing (currently placeholder $2 each)

## 5. Food Detail Screen
- [x] Large image, name, description, price
- [x] Ingredients tags
- [x] Prep time, calories, spice level
- [x] Add-ons selector
- [x] Quantity selector
- [x] Favorite toggle
- [x] Special instructions field
- [x] Suggested pairings
- [x] Add to Cart

## 6. Cart & Checkout
- [x] Quantity adjust / remove items
- [x] Promo code (ZONE20 demo)
- [x] Subtotal / delivery / tax / total breakdown
- [x] Cooking instructions field
- [x] Fulfillment choice: Delivery / Pickup / Dine-In
- [x] Delivery form (address, GPS button, phone, notes)
- [x] Payment: EcoCash / Cash on Delivery (live)
- [x] Payment: Visa / Mastercard / PayPal / Apple Pay / Google Pay (visual placeholder only — **not wired to a real processor**)
- [x] Place Order → generates formatted message → opens WhatsApp
- [x] Order Confirmation screen

## 7. Orders & Loyalty
- [x] Order history list
- [x] Reorder from history
- [x] Loyalty points (1 pt / $1 spent)
- [x] Loyalty screen (points, redemption info, VIP tiers, referral, badges) — **UI only, no real backend logic**
- [ ] Real redemption flow (points → discount at checkout)
- [ ] Real birthday-reward trigger
- [ ] Real referral tracking

## 8. Profile
- [x] Profile hub screen
- [x] Saved Addresses — **static placeholder data, "Add New Address" not functional**
- [x] Favorite Meals (fully functional, pulls from real favorites state)
- [x] Coupons — **static placeholder, not linked to cart**
- [x] Notifications — **toggle UI only, no real push notifications**
- [x] Account Settings — **rows are placeholders, not functional**
- [x] Dark/Light mode toggle (fully functional)
- [x] Log out flow

## 9. Restaurant Experience Page
- [x] Story section (placeholder copy — needs your real story)
- [x] Gallery images (using real menu photos)
- [x] Chef profile (placeholder name/bio — needs real chef info)
- [x] Awards (placeholder — needs real awards, if any)
- [x] Operating hours (placeholder times — needs your real hours)
- [x] Address (real: No. 8 Campbell Road, Borrowdale)
- [ ] **Reservation booking — button present, not functional**
- [ ] **Google Maps directions — label present, not linked**
- [x] Customer reviews (placeholder — needs real reviews)

## 10. KidCamp Page
- [x] Section layout (Kids Menu, Birthday Packages, Play Area, Family Events cards)
- [ ] **Booking form — UI only, doesn't submit anywhere**
- [ ] Real content for each KidCamp offering

## 11. Support / Contact
- [x] Real phone number (+263 77 643 6754)
- [x] Real address
- [x] Real Instagram handle (@zonegarden_.borrowdale)
- [x] WhatsApp chat button (opens real WhatsApp)
- [x] Call button (opens dialer)
- [x] Email button (opens mail app)
- [ ] **Live Chat — button present, not functional**
- [x] FAQ list — **placeholder questions, not real content**

## 12. Integrations & Backend
- [x] WhatsApp order handoff (client-side, no server)
- [ ] **No real backend / database** — all state is in-memory and resets on reload
- [ ] No real payment processor
- [ ] No real authentication (login accepts anything)
- [ ] No push notifications
- [ ] No reservation system
- [ ] No CMS for restaurant content (story, hours, reviews, chef bio)

---

### Legend
- [x] = built and working in the prototype
- [ ] = not yet built, or built as visual-only placeholder

**Next up (per your message):** you'll send real photos for the remaining menu items, and we'll make the Restaurant Experience, KidCamp, Support, and Profile info sections functional/real rather than placeholder.
