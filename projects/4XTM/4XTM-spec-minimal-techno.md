# 4XTM Live Performance System - Project Specification

## Overview
A modular live performance system for minimal techno using 4x Behringer X-Touch Mini controllers and 1x Novation Launch Control XL. The system provides 32 individual instrument channels with deep sound design control (XTMs) and high-level mixing (LCXL).

**Musical Style:** Minimal/Deep Techno (Luigi Tozzi, Giegling, Romanian minimal)  
**Target BPM:** 120-130  
**Primary Sampler:** XLN XO (~40k one-shot library)

---

## System Architecture

### Controller Layout
- **XTM 1-4:** Individual instrument control (8 channels each = 32 total)
  - 8 encoders per XTM for macro control
  - Encoder push buttons for preset bank switching
  - Per-channel control: sound design + performance parameters

- **LCXL:** High-level mixing/submix
  - 8 channels: 4 group submixes + 3 send returns + 1 utility
  - 3 knobs per channel (sends/filters/etc.)
  - Mute/Solo controls
  - Master-level mixing decisions

### Signal Flow Philosophy
1. **Sound Design Layer** (per-instrument): Macro-controlled parameters for sonic character
2. **Performance Layer** (per-group): Shared FX chains with expressive control
3. **Mixing Layer** (LCXL): Group levels, sends, high-level balance

---

## XTM 1 - Base Drums (Group Submix)

### Channel Assignments
1. **Kick** - Primary kick drum
2. **Kick (layer)** - Secondary kick for layering/switching
3. **Snare** - Main snare/rimshot
4. **Clap** - Hand clap/percussion
5. **Hat 1** - Closed hi-hat
6. **Hat 2** - Open hi-hat
7. **Hat 3/Ride** - Ride cymbal or textural hat
8. **Crash/FX** - Crash cymbal or percussion FX

### Design Goals
- Tight, punchy, minimal drum palette
- Individual character per element
- Clean separation in frequency spectrum
- Performance-ready with consistent gain staging

---

## XTM 2 - Grooves & Loops (Group Submix)

### Channel Assignments (TBD)
8 channels for:
- Drum loops (shuffled/swung grooves)
- Vocal chops/snippets
- Percussion fills
- Textural loops
- FX hits/risers
- Rhythmic elements
- Background movement
- Transitional sounds

### Design Goals
- Complements base drums (not replacing them)
- Adds groove/swing variations
- Creates tension/release moments
- Provides evolving rhythmic texture

---

## XTM 3 - Bass & Atmosphere (Group Submix)

### Channel Assignments
**Channels 1-4: Bass Section**
- Bass 1: Main bassline instrument
- Bass 2: Sub-bass/drone
- Bass 3: Mid-bass/melodic bass
- Bass 4: Alternative bass/bass FX

**Channels 5-8: Atmosphere Section**
- Atmo 1: Background pad/texture
- Atmo 2: Noise/field recordings
- Atmo 3: Ambient swells
- Atmo 4: Environmental sound/drones

### Design Goals
- Bass: Deep, warm, groove-locked foundation
- Atmosphere: Spacious, evolving, non-intrusive
- Clear separation between sub/low-mid/mid frequencies
- Creates depth without cluttering the mix

---

## XTM 4 - Main Instruments (Group Submix)

### Channel Assignments (TBD)
8 channels for:
- Lead synths
- Melodic sequences
- Pads/strings
- Chord stabs
- Arpeggios
- Harmonic elements
- Sample-based melodies
- Evolving textures

### Design Goals
- Carries melodic/harmonic content
- Sits above bass/drums without masking
- Provides musical hooks and themes
- Creates emotional peaks and valleys

---

## Individual Channel Architecture (Reference: Kick Channel)

### Per-Instrument Layer (8 Macros on XTM Encoder)
**Sound Design Parameters** (varies per instrument):
- Examples from Kick: Click, Decay, Pitch, Crunch, Lo EQ, Mid EQ, Hi EQ, Gain

**Philosophy:**
- Rarely adjusted during performance
- Prepared in studio/sound design phase
- Deep control over sonic character
- Gain-matched across instrument selector slots

### Instrument Selector (up to 8 variations)
- Each channel uses Bitwig Instrument Selector
- 8 slots = 8 different sounds/presets per channel
- Switched during performance for variety
- Each slot contains: Sampler/Synth + EQ-DJ (or equivalent) + Gain

### Performance FX Chain (shared per group, not per channel)
Applied at group level, affects whichever instrument is playing:
- Static utility EQ (cleanup)
- Dynamics/Compression (parallel, via FX layer)
- Saturation (parallel, Bit-8 or similar)
- Resonant Filter (LP/HP/Res for expressive sweeps)
- Output to sends

---

## Send FX Chains (3 Send Returns on LCXL)

### Send A - Reverb (Space)
- Character: Deep, spacious, long decay
- Use: Room/ambience, depth creation
- **Swappable FX:** Multiple reverb types (hall/plate/spring/shimmer)
- Control from LCXL: Send level per group

### Send B - Filter Delay (Rhythm)
- Character: Filtered/dubbed-out delay
- Use: Rhythmic echoes, dub techno textures
- **Swappable FX:** Different delay characters (tape/digital/granular)
- Control from LCXL: Send level per group

### Send C - Delay (Texture)
- Character: Clean/modulated delay
- Use: Width, movement, fills
- **Swappable FX:** Various delay/modulation types
- Control from LCXL: Send level per group

### Send FX Philosophy
- Each send has **swappable FX presets** to prevent monotony
- Sends can route into themselves (feedback loops for dub effects)
- Controlled at group level (LCXL) for broad strokes

---

## LCXL Mixer Layout (8 Channels)

### Channel Assignments
1. **XTM 1 Group** (Base Drums submix)
2. **XTM 2 Group** (Grooves & Loops submix)
3. **XTM 3 Group** (Bass & Atmosphere submix)
4. **XTM 4 Group** (Main Instruments submix)
5. **Send A Return** (Reverb)
6. **Send B Return** (Filter Delay)
7. **Send C Return** (Delay)
8. **Utility Channel** (TBD - master FX/recording/etc.)

### Per-Channel Control (3 Knobs)
- Knob 1: Send A level
- Knob 2: Send B level
- Knob 3: Send C level (or filter/EQ - TBD per use)
- Mute/Solo buttons
- Level faders

---

## Performance Features

### Preset Bank Switching (via XTM Encoder Pushes)
- Push encoder = switch entire XTM's 8 channels to preset bank
- Banks contain pre-configured instrument selector positions
- Allows quick "scene" changes (e.g., "minimal kit" vs "aggressive kit")
- Safe return to known-good states during performance

**Implementation:** Custom script feature (not yet implemented)

### Horizontal/Vertical Navigation
- **Horizontal:** Switch between instruments within a channel (instrument selector 1-8)
- **Vertical:** Switch between preset banks across all channels (encoder push)
- Creates grid-like performance matrix

---

## Project Phases

### Phase 1: XTM 1 - Base Drums ✅ (In Progress)
- [x] Channel 1: Kick (complete with sound design + performance FX)
- [ ] Channel 2: Kick (layer)
- [ ] Channel 3: Snare
- [ ] Channel 4: Clap
- [ ] Channel 5: Hat 1
- [ ] Channel 6: Hat 2
- [ ] Channel 7: Hat 3/Ride
- [ ] Channel 8: Crash/FX

### Phase 2: Send FX Chains
- [ ] Send A: Reverb with swappable presets
- [ ] Send B: Filter Delay with swappable presets
- [ ] Send C: Delay with swappable presets
- [ ] Send feedback routing setup

### Phase 3: XTM 3 - Bass & Atmosphere
- [ ] Channels 1-4: Bass instruments
- [ ] Channels 5-8: Atmospheric textures

### Phase 4: XTM 2 - Grooves & Loops
- [ ] 8 channels: Various rhythmic/textural loops

### Phase 5: XTM 4 - Main Instruments
- [ ] 8 channels: Synths, pads, melodic elements

### Phase 6: Integration & Testing
- [ ] LCXL mapping and routing
- [ ] Gain staging across entire system
- [ ] CPU optimization
- [ ] Preset bank creation
- [ ] Template version (instruments removed)

---

## Gain Staging Strategy

### Target Levels (relative to -15 dB master reference)
- **Kicks:** -18 to -17 dBFS (peak)
- **Snares/Claps:** -20 to -18 dBFS (peak)
- **Hats:** -24 to -20 dBFS (peak)
- **Bass:** -20 to -18 dBFS (RMS)
- **Loops/Grooves:** -24 to -20 dBFS (depends on density)
- **Synths/Pads:** -24 to -18 dBFS (depends on role)
- **Group Submixes:** -12 to -10 dBFS (peak, with headroom)
- **Master:** -6 to -3 dBFS (before limiter)

### Philosophy
- Gain-match at instrument selector level (per sound)
- Group processing adds minimal gain
- Sends return at lower levels (-30 to -20 dBFS)
- Master limiter as safety net only

---

## Frequency Allocation & Mixing Strategy

### XTM 1 - Base Drums: 30 Hz - 12 kHz (focus: 60-120 Hz, 3-8 kHz)
- Kick: Sub + punch (40-100 Hz + 3-5 kHz)
- Snare: Body + snap (150-250 Hz + 2-4 kHz)
- Hats: Air + sizzle (8-15 kHz)
- Clean separation via static EQ

### XTM 2 - Grooves & Loops: Full spectrum (mixed content)
- Filtered/EQ'd to complement base drums
- Avoid competing with primary kick/snare
- Focus on mid-range texture (500 Hz - 5 kHz)

### XTM 3 - Bass & Atmosphere: 30 Hz - 5 kHz (focus: 40-200 Hz + 1-3 kHz air)
- Bass: Sub to low-mid (40-300 Hz)
- Atmosphere: Low-mid to mid-high (200 Hz - 8 kHz)
- Creates depth without masking drums

### XTM 4 - Main Instruments: 200 Hz - 15 kHz (focus: 500 Hz - 8 kHz)
- Lives above bass, between drum transients
- Provides melodic/harmonic content
- Filtered to avoid low-end buildup

### Philosophy
This creates natural submix organization:
- **Low-end:** Kick + Bass (minimal overlap via EQ)
- **Mid-range:** Instruments + Loops (textural layer)
- **High-end:** Hats + Instrument air (sparkle/space)

---

## Channel Processing Template (Reference: Kick)

### Signal Chain (per-channel group FX)
1. **Static EQ:** Utility (HPF @ 30 Hz, surgical cuts/boosts)
2. **Dynamics:** Parallel compression via FX layer (groove/glue)
3. **Saturation:** Bit-8 with mix knob (warmth/harmonics)
4. **Resonant Filter:** LP/HP/Res (performance expression)
5. **Output to Sends**

### Per-Channel Variations
- **Drums:** Tight compression, subtle saturation, aggressive filtering
- **Bass:** Gentle compression, warmth saturation, lowpass filtering
- **Loops:** Variable compression, character saturation, bandpass filtering
- **Instruments:** Transparent compression, optional saturation, creative filtering

---

## Template Strategy

### Performance Template (Current Focus)
- Fully loaded with instruments/samples
- Dialed-in for minimal techno aesthetic
- Ready for immediate performance/jamming
- Specific sounds chosen and gain-staged

### Clean Template (Future)
- All samplers/synths removed
- Processing chains intact
- Macro mappings preserved
- Ready for adaptation to any style
- Neutral gain staging

---

## Technical Considerations

### CPU Management
- XO instances: Limit to 32 max (one per channel)
- FX chains: Use efficient Bitwig devices (avoid third-party CPU hogs)
- Freeze/flatten loops if needed
- Monitor CPU per-group to identify bottlenecks

### Reliability for Live Performance
- No external dependencies (except XO)
- Bitwig-native FX only (for now)
- Tested routing (no dropouts)
- Backup presets/banks saved
- Controller scripts stable and tested

---

## Notes & Future Expansions

### Potential Additions
- MIDI effects for generative sequences
- Note repeat/stutter effects
- Macro recorder for automation
- Additional send FX (reverb + delay = 2, could add modulation/distortion)
- External hardware integration (if budget allows)

### Style Adaptations
This 4-group architecture should work for:
- Techno variations (hard/dub/melodic)
- House (deep/tech/minimal)
- Electronica/IDM
- Ambient/experimental

The key is maintaining the **4-layer sonic philosophy**:
1. Rhythmic foundation (drums)
2. Textural movement (loops/grooves)
3. Low-end anchor + space (bass/atmo)
4. Melodic/harmonic content (instruments)

---

## Appendix: Kick Channel Settings (Reference)

### Sound Design Layer (XO + EQ-DJ)
**XO Parameters:**
- Click
- Decay
- Pitch
- Crunch

**EQ-DJ Parameters:**
- Low Crossover: 100 Hz
- High Crossover: 4 kHz
- Lo Gain (macro)
- Mid Gain (macro)
- Hi Gain (macro)

**Output Gain:** Compensation for EQ/processing

### Performance FX Chain (Group Level)
**Static EQ (EQ+ or EQ-5):**
- HPF @ 30 Hz (12 or 24 dB/oct)
- Optional: Low shelf @ 80 Hz, +1.5 dB

**Dynamics (in FX Layer):**
- Low Threshold: -22 to -20 dB
- Low Ratio: 3:1
- High Threshold: -15 to -18 dB
- High Ratio: 2:1
- Attack: 30-50 ms
- Release: 100-120 ms
- Mode: RMS
- FX Layer Mix: 25-40% (mapped to macro)

**Bit-8 Saturation:**
- Clock: Max frequency
- Shape: Soft clip
- Anti-alias: ON
- Mix: 0-50% (mapped to macro)

**Resonant Filter (custom preset):**
- LP Cutoff (macro)
- HP Cutoff (macro)
- Resonance shared (macro)

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-08  
**Status:** Phase 1 in progress (Kick complete, 7 drum channels remaining)

