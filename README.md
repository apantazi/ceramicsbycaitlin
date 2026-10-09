# Ceramics by Caitlin

Run `npm start`. Portfolio: http://localhost:5173. Editor: http://localhost:5173/admin.html.

## Caitlin’s editing routine

1. Open the editor and choose a pot.
2. Enter height, width/diameter, capacity (including units), description, and photo description.
3. Choose its category. For statement mugs, check **Drink your coffee with a purpose**.
4. Check **Show on website**, then click **Save website**. Refresh the portfolio.

Save writes `catalog.json` and `content.js` to disk. The previous catalog is retained in `catalog.json.backup`. This is not browser-only storage.

## New pottery and categories

Put new JPG, PNG, or WebP photos in `images`, click **Add a pot**, and enter image paths one per line. The first photo is the cover. HEIC originals need conversion before use on the web.

Under **Manage categories**, add future categories such as Gravy boats or Berry bowls. Planters is already available in the editor and stays hidden on the portfolio until a published planter is added. Hide a pot by clearing **Show on website** and saving.

The supplied 45 HEIC photographs have been converted to JPG and grouped into 12 apparent pieces. Titles and photo groupings are editable; dimensions have deliberately been left blank for Caitlin to measure. There are three photographed statement mugs: two Fight fascism designs and one anti-AI mug. Confirm whether these represent the two designs Caitlin described. Original files are preserved.

## Publishing

Repository: https://github.com/apantazi/ceramicsbycaitlin. Website: https://ceramicsbycaitlin.com.

Pushing changes to `main` publishes the portfolio automatically through GitHub Pages. After saving local edits, commit and push `catalog.json` and any new photos or videos. The build generates the public `content.js` from the catalog.

Run `npm run build` to create the public site in `dist`. The deployment includes the portfolio and browser-ready media, and excludes the local editor, camera originals, and review files. See `DOMAIN-SETUP.md` for the DNS records and GitHub Pages settings.

Instagram remains the contact and repeat-order route. Custom ordering is not offered on the site.

The editor is a local backend bound to 127.0.0.1, with same-origin writes and a backup on save. It has no public login. Do not expose this server or deploy the editor as a public backend. A hosted editor needs authenticated hosting before Caitlin can update the public site from any device.

## Photo presentation and studio media

Gallery photos are grouped by collection, with two views per pot and no individual captions. Titles and dimensions are shown only in the enlarged view.

`media/originals/photos` and `media/originals/videos` contain the 35 loose originals, renamed descriptively. `media/filename-map.json` records their former filenames. `media/photos` contains browser-ready JPGs and video posters; `media/videos` contains two selected H.264 MP4 clips with audio removed. Original media is retained. Three original mug-motion MP4 files could not be decoded and are retained without being published.

For static publishing, also upload `media/photos` and `media/videos`. Do not upload the original-media directory. Contact sheets are in `review`.

HTML is saved as UTF-8, and the local server specifies UTF-8 for text responses. Always use explicit UTF-8 when editing these files programmatically.

Studio photos open in a large viewer; video cards open real MP4 videos with playback controls. Both clips are silent and user-triggered. The viewer supports previous/next buttons, arrow keys, and Escape; closing it stops playback.
