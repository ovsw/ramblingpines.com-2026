# Rambling Pines design

This is a reproduction of the old Rambling Pines site, not a redesign.
The build inputs are the desktop and phone captures in
`docs/migration/screenshots/`, made on 16 October 2026, and the old Gatsby
components. Ovi gives the visual verdict after the build. No visual verdict
has been given for this shell.

## Color and type

Primary teal is `#008080`, with light `#4cb0af` and dark `#005354`.
Accent yellow is `#f7db54`, with dark `#c1aa1d` and light `#ffff86`.
Body text is `#6c6b73`. The cream background is `#fbf8ef`, muted is
`#efe9d7`, and page paper can be white.

Dosis is the heading and menu face at weights 400, 600 and 700. Lato is the
body face at weights 400 and 700, with a 400 italic. Font files and their
OFL licenses are local in `public/fonts`. Next serves the fonts from the
Website. Visitors do not fetch fonts from Google.

Use 640, 769, 1024, 1280 and 1440 px as breakpoint guides. The desktop
header begins at 1024 px. The side menu changes to an accordion below
769 px. Body copy uses a 1.7 line height. Headings use teal and Dosis.

## Header

The header stays at the top during scroll. It has the old white paper
texture, yellow bottom edge, centered camp logo and two top link columns.
The desktop menu has group buttons with two-column dropdowns. The mobile
header has contact icons, the centered logo and a drawer button. The drawer
contains all menu groups, top links and contact links. Radix provides focus
management and Escape handling.

Site settings supply identity, logo, contact details and the announcement.
Navigation supplies the top link columns and menu groups. The announcement
supports bold, italic and safe links. Close hides it for the browser session;
if storage is disabled, dismissal lasts while the app remains loaded.
The announcement is static text, so it remains readable without a marquee.

## Inner-page navigation

The side menu resolves the page's section against the menu group title.
A missing section, `none`, or no matching group gives no side menu.
Desktop uses a left column. Phones use a native details accordion above the
content. The current link has `aria-current=page` and teal bold text.
The generic page renderer owns the banner and main content in issue #14.

## Footer and paper edges

The footer uses the old forest background. Contact details occupy the left
half on desktop; social links and the ACA logo occupy the right half. On
phones these areas stack and align to the center. Footer contact and social
fields take precedence over settings; settings supply fallback values.
Legal links and copyright come from the footer singleton. Social links use the
same Font Awesome brand symbols as the old site. Local SVG files retain the
Font Awesome Free attribution and CC BY 4.0 license notice.

Only used texture assets are copied to `public/images/shell`. The paper
header, menu background, forest footer and torn white top/bottom edges are
CSS backgrounds. `.paper-edge-top` is available for the page banner edge.
The 404 page uses the same header, footer, colors and fonts.

## Analytics and inspection

The root layout reads the GTM container from site settings and loads it after
interactive on every route, including 404. It accepts a GTM container ID,
not editor-supplied script code. Other external scripts belong to their
specific content sections.

For Ovi's later visual check use 1440 px desktop and 390 px phone widths.
Inspect the header, open a menu group, close the alert and reload, open the
phone drawer, expand a section menu, and inspect the footer and a missing URL.

## Home page

The home page renders its six imported Sanity sections. The hero uses the
original art logo, Mux background playback and Mux poster. A local copy of the
old poster covers a missing playback ID or failed poster load. Phones and
reduced-motion sessions show the poster. A button pauses desktop playback.
Transportation and lunch use the imported illustrations. Transportation's
imported area paragraphs form county columns. Programs use the four imported
SVG icons and card links. The imported card description lives in `ageRange`.
The Programs schema has no section-level button, so its old Request Info
button is not present. Lunch retains its Request Info body link.
The location section shows the map and imported address. Testimonials use a
scrollable row, with previous and next buttons and keyboard scrolling.
The original yellow paper, white paper and testimonial background are local
assets. Check the complete home page at 1440 px and 390 px. Ovi has not yet
given a visual verdict. Mux playback and third-party map content are not
part of the automated release tests.
