# PodCars handover

For a Claude Code session running on the Mac (`nhj-mbp-M3Max`), started in the `20250801-HilmanPodCars` folder. The work so far was done in a cloud session that could not reach the Mac's drive, so the edit with the original footage continues here.

Branch: `claude/intelligent-bell-ntbuox`.

## What PodCars is

A short-form show by Studiohakim Productions: two people talk in a car about their video shoots, and the real footage cuts to 2D cartoon gags whenever they describe something. The source so far is one Instagram reel (`DL7A8bDuUTh`, 3:48, Malay/English).

- **Driver:** olive shirt, short hair. He shot the footage being discussed.
- **Passenger:** flat cap, glasses, beard, black tee. He is the editor ("I edit lah").

## What is in the repo

| Folder | What it is |
|---|---|
| `car-talk/` | OpenFilm project for the full film (1:31): 3 s intro, real footage alternating with seven cutaways, animated end card |
| `podcars-clips/` | OpenFilm project holding three cold-open clips back to back in one `film.html` |
| `podcars-intros/` | Four 3-second intros as finished clips, plus `all-four.film.html` with their sound timing |
| `sound-fx/` | 60 meme sound effects as individual files, with an index |

Everything is built with OpenFilm. Run `npx -y openfilm@latest` for its manual, and read `npx -y openfilm@latest skill edit` before changing a film. Rendered videos are not committed (`*.mp4` in the two project folders is ignored); the owner has copies.

## How the films are put together

- **Pages:** each cutaway is one HTML page that draws any moment `t` (`client`, `mystery`, `lens85`, `tooclose`, `midshot`, `slowmo`, `ring`), plus `intro.html` and `end.html`.
- **Shared code:** `toon.js` (characters, helpers, lip-sync), `props.js` (couple, camera, viewfinder, burst), `intro-kit.js` (side-view car, the PodCars logo).
- **Lip-sync:** mouths follow the reel's loudness, stored in `env.js` at 30 values per second.
- **Timing is tied to the reel.** Each cutaway has a constant `R0`, the second of the Instagram reel where it starts, and its internal beats are written in reel seconds. `film.html` places the page at the matching film time.

### The three clips (`podcars-clips/film.html`)

Each runs hook → intro A → content → end card. Render one clip by its range.

| Clip | Range (s) | Hook line | Content, in reel seconds |
|---|---|---|---|
| 1 Chasing Vows | 0–47.2 | "is he from Chasing Vows?" | 50.85–88.2 |
| 2 Framing | 47.2–76 | "kau punya tu too close up" | 133.0–152.9 |
| 3 Slow-mo | 76–104.85 | "asal… punya computer ni, semua slow-mo" | 181.0–197.55 and 202.7–204.95 |

## Decisions the owner has made

- **Name:** "PodCars", one word, with "by Studiohakim Productions" in small type under it.
- **Intro:** option A (sunny comic) for this video. All four are kept as assets.
- **Horn:** a double honk.
- **Structure:** real car footage, cutting to 2D only when they talk about the gag, always alternating; end on the 2D end card.
- **Subtitles:** no English subtitles. The cutaways carry captions in the original Malay/English wording (`podcars-clips/captions.vtt`).
- **Format:** vertical 1080×1920, highlight cut, cartoon likenesses approved.
- **Music:** only under the intro and end card, so it does not fight the dialogue.

## What the Mac session is for

The owner is ingesting the original Insta360 footage into three views, in `/Volumes/ACT-WKF01/RAW_FILES/INSTA360/2025/08_AUGUST`, and wants to start editing once that is done.

Before editing, ask the owner:

1. Which view to use for each speaker and for the two-shot.
2. Whether this is a re-cut of the current clips with better footage, or a new episode.
3. Whether the new files have the same audio as the reel, and what the time offset is.

### Swapping in the original footage

- Replace `assets/reel.mp4`, which is Instagram's 720×1280 copy scaled up and has the reel's captions burned in.
- The new footage will not share the reel's timeline. Find the offset between the two, then shift each video clip's `#t=` and each cutaway's `R0` and internal beat times by it.
- Rebuild `env.js` from the new audio, or the lip-sync will drift.
- The original footage has no burned-in captions, so the real-footage sections will need captions too.

## Open items

- **Review findings not yet acted on:** punch in on the speaker; hold each return to the car for at least 3 seconds (three are 1–2 s); break up the 11-second client cutaway; add the show's handle and a "part 2" tease to the end card.
- **Clip 1 is 47 s.** Dropping the "mysterious cut / 85mm" part brings it to about 31 s.
- **Sound effects:** 16 of the 60 are still unnamed (2, 16, 18, 22, 24, 30, 33, 34, 35, 36, 37, 40, 43, 44, 54, 57). The owner is naming them one at a time; rename the file and update `sound-fx/meme-sound-effects-2026.md`. None are used in a film yet.
- **Intro D:** the logo slightly overlaps the car's roof.
- **Cutaway captions** use a plain bold font, not the comic style of the reel's captions.

## Things that were never verified

- No one in the cloud session could watch or listen to anything. Stills were checked; lip-sync, sound mix and timing were not.
- Who says each line was worked out from the reel's captions and camera cuts. A few two-shot lines are guesses.
- The transcript came from automatic speech recognition of fast, mixed-language speech.
- The sound effects file was labelled "no copyright". That is unverified, several are recognisable clips, and effects 8, 28 and 52 contain strong language.
- The reference for the animation style was Mediacorp's *Downstairs*; only its thumbnail was seen.

## Notes from the cloud setup that do not apply on the Mac

The cloud container needed a browser workaround (`PLAYWRIGHT_BROWSERS_PATH`) and an allowlist of network hosts. On the Mac, OpenFilm downloads its own browser on first run and Studio opens normally.
