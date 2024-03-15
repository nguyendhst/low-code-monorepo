const raw = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M287 435q-42 0-74.5 18.5t-51 52.5-18.5 77 18.5 76.5 51.5 52 74 18.5q38 0 67-15l-92-92h74l60 59q16-18 24-39 11-26 11-60 0-43-18.5-77T361 453.5 287 435zm590-328h-57q-10 0-19.5-5T786 89l-39-72q-6-8-14.5-12.5t-18-4.5T696 4.5 682 17l-39 72q-6 8-15 13t-19 5h-58q-33 0-61 16.5t-44.5 45T429 230v56H123q-34 0-62 16.5T16.5 347 0 408v362q0 33 16.5 61.5t44.5 45 62 16.5h69q11 0 20 5t15 13l26 72q6 8 14.5 12.5t18.5 4.5 18.5-4.5T318 983l27-72q6-8 15-13t19-5h70q33 0 61-16.5t44.5-45T572 770v-56h305q34 0 62-16.5t44.5-44.5 16.5-61V230q0-33-16.5-61.5t-44.5-45-62-16.5zM426 786l-29-30q-46 30-110 30-58 0-104.5-26.5t-73-73T83 583t26.5-103.5 73-73.5 104-27T391 406t73.5 73.5T491 583q0 82-54 140l63 63h-74zm503-194q0 21-15.5 36T877 643H571v-52h14l42-94h168l41 94h64L715 177 571 482v-74q0-35-19-65.5T500 297v-67q0-21 15-36t36-15h70q22 0 34.5-7t20.5-21q6-9 14-31 7-18 11-26.5t13.5-8.5 12.5 8l10 27q10 28 15 36 8 13 19.5 18t36.5 5h69q21 0 36.5 15t15.5 36v362zM652 440l60-132 59 132H652z"/></svg>`;
// Create a data URL with the base64 string
const base64Svg = Buffer.from(raw).toString("base64");

const QAIcon = {
    dataUrl: "data:image/svg+xml;base64," + base64Svg,
};

const gs_icon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-spreadsheet"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>`;
export const GSIcon64 = "data:image/svg+xml;base64," + Buffer.from(gs_icon).toString("base64");

export default QAIcon;
