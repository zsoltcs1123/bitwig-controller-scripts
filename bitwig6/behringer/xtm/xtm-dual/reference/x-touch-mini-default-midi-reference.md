# Behringer X-Touch Mini - Default Preset MIDI Reference

## Device Information
- **Model**: X-Touch Mini
- **Firmware Version**: 1.10
- **Editor Version**: 1.21
- **Operating Modes**: Standard Mode / MC (Mackie Control) Mode
- **Recommended Mode**: MC Mode (for full control and Layer A/B buttons)
- **Preset**: Default

## Hardware Layout
- 8 Push Encoders with LED rings
- 16 Buttons (2 rows of 8) with LED backlights
- 1 Fader (60mm)
- 2 Layer buttons (A/B)
- 1 MC (Mackie Control) button

---

## STANDARD MODE (Original Configuration)

### Device Configuration
- **Default MIDI Channel**: 11 (CH 12 in 1-based counting)
- **Global Channel**: CH 12 (configurable for all device functions)
- **Layer A/B Buttons**: ❌ Not available (no MIDI output in Standard Mode)
- **Layer Control**: Firmware-controlled switching between Layer A and Layer B

## ENCODERS (EN 1-8) - Standard Mode

**Note**: The device has two layers (A/B) controlled via firmware. Layer switching sends different MIDI messages for the same physical controls.

### Layer A - Push Function (Encoder Press)
| Encoder | MIDI Channel | Type | Note Number | Note Name | Min Value | Max Value | Behavior |
|---------|--------------|------|-------------|-----------|-----------|-----------|----------|
| EN 1    | 11           | Note | 0           | C-2       | 0         | 127       | Momentary |
| EN 2    | 11           | Note | 1           | C#-2      | 0         | 127       | Momentary |
| EN 3    | 11           | Note | 2           | D-2       | 0         | 127       | Momentary |
| EN 4    | 11           | Note | 3           | D#-2      | 0         | 127       | Momentary |
| EN 5    | 11           | Note | 4           | E-2       | 0         | 127       | Momentary |
| EN 6    | 11           | Note | 5           | F-2       | 0         | 127       | Momentary |
| EN 7    | 11           | Note | 6           | F#-2      | 0         | 127       | Momentary |
| EN 8    | 11           | Note | 7           | G-2       | 0         | 127       | Momentary |

### Turn Function (Encoder Rotation)
| Encoder | MIDI Channel | Type | CC Number | Min Value | Max Value | LED Ring Mode |
|---------|--------------|------|-----------|-----------|-----------|---------------|
| EN 1    | 11           | CC   | CC1       | 0         | 127       | Pan           |
| EN 2    | 11           | CC   | CC2       | 0         | 127       | Pan           |
| EN 3    | 11           | CC   | CC3       | 0         | 127       | Pan           |
| EN 4    | 11           | CC   | CC4       | 0         | 127       | Pan           |
| EN 5    | 11           | CC   | CC5       | 0         | 127       | Pan           |
| EN 6    | 11           | CC   | CC6       | 0         | 127       | Pan           |
| EN 7    | 11           | CC   | CC7       | 0         | 127       | Pan           |
| EN 8    | 11           | CC   | CC8       | 0         | 127       | Pan           |

### Layer B - Push Function (Encoder Press)
| Encoder | MIDI Channel | Type | Note Number | Note Name | Min Value | Max Value | Behavior |
|---------|--------------|------|-------------|-----------|-----------|-----------|----------|
| EN 1    | 11           | Note | 24          | C0        | 0         | 127       | Momentary |
| EN 2    | 11           | Note | 25          | C#0       | 0         | 127       | Momentary |
| EN 3    | 11           | Note | 26          | D0        | 0         | 127       | Momentary |
| EN 4    | 11           | Note | 27          | D#0       | 0         | 127       | Momentary |
| EN 5    | 11           | Note | 28          | E0        | 0         | 127       | Momentary |
| EN 6    | 11           | Note | 29          | F0        | 0         | 127       | Momentary |
| EN 7    | 11           | Note | 30          | F#0       | 0         | 127       | Momentary |
| EN 8    | 11           | Note | 31          | G0        | 0         | 127       | Momentary |

### Layer B - Turn Function (Encoder Rotation)
| Encoder | MIDI Channel | Type | CC Number | Min Value | Max Value | LED Ring Mode |
|---------|--------------|------|-----------|-----------|-----------|---------------|
| EN 1    | 11           | CC   | CC11      | 0         | 127       | Pan           |
| EN 2    | 11           | CC   | CC12      | 0         | 127       | Pan           |
| EN 3    | 11           | CC   | CC13      | 0         | 127       | Pan           |
| EN 4    | 11           | CC   | CC14      | 0         | 127       | Pan           |
| EN 5    | 11           | CC   | CC15      | 0         | 127       | Pan           |
| EN 6    | 11           | CC   | CC16      | 0         | 127       | Pan           |
| EN 7    | 11           | CC   | CC17      | 0         | 127       | Pan           |
| EN 8    | 11           | CC   | CC18      | 0         | 127       | Pan           |

---

## BUTTONS (BT 1-16)

### Layer A - Upper Row (BT 1-8)
| Button | MIDI Channel | Type | Note Number | Note Name | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|-----------|----------|
| BT 1   | 11           | Note | 8           | G#-2      | 0         | 127       | Momentary |
| BT 2   | 11           | Note | 9           | A-2       | 0         | 127       | Momentary |
| BT 3   | 11           | Note | 10          | A#-2      | 0         | 127       | Momentary |
| BT 4   | 11           | Note | 11          | B-2       | 0         | 127       | Momentary |
| BT 5   | 11           | Note | 12          | C-1       | 0         | 127       | Momentary |
| BT 6   | 11           | Note | 13          | C#-1      | 0         | 127       | Momentary |
| BT 7   | 11           | Note | 14          | D-1       | 0         | 127       | Momentary |
| BT 8   | 11           | Note | 15          | D#-1      | 0         | 127       | Momentary |

### Lower Row (BT 9-16)
| Button | MIDI Channel | Type | Note Number | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|----------|
| BT 9   | 11           | Note | 8           | 0         | 127       | Momentary |
| BT 10  | 11           | Note | 9           | 0         | 127       | Momentary |
| BT 11  | 11           | Note | 10          | 0         | 127       | Momentary |
| BT 12  | 11           | Note | 11          | 0         | 127       | Momentary |
| BT 13  | 11           | Note | 12          | 0         | 127       | Momentary |
| BT 14  | 11           | Note | 13          | 0         | 127       | Momentary |
| BT 15  | 11           | Note | 14          | 0         | 127       | Momentary |
| BT 16  | 11           | Note | 15          | 0         | 127       | Momentary |

### Layer B - Upper Row (BT 1-8)
| Button | MIDI Channel | Type | Note Number | Note Name | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|-----------|----------|
| BT 1   | 11           | Note | 48          | C2        | 0         | 127       | Momentary |
| BT 2   | 11           | Note | 49          | C#2       | 0         | 127       | Momentary |
| BT 3   | 11           | Note | 50          | D2        | 0         | 127       | Momentary |
| BT 4   | 11           | Note | 51          | D#2       | 0         | 127       | Momentary |
| BT 5   | 11           | Note | 52          | E2        | 0         | 127       | Momentary |
| BT 6   | 11           | Note | 53          | F2        | 0         | 127       | Momentary |
| BT 7   | 11           | Note | 54          | F#2       | 0         | 127       | Momentary |
| BT 8   | 11           | Note | 55          | G2        | 0         | 127       | Momentary |

### Layer B - Lower Row (BT 9-16)
| Button | MIDI Channel | Type | Note Number | Note Name | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|-----------|----------|
| BT 9   | 11           | Note | 56          | G#2       | 0         | 127       | Momentary |
| BT 10  | 11           | Note | 57          | A2        | 0         | 127       | Momentary |
| BT 11  | 11           | Note | 58          | A#2       | 0         | 127       | Momentary |
| BT 12  | 11           | Note | 59          | B2        | 0         | 127       | Momentary |
| BT 13  | 11           | Note | 60          | C3        | 0         | 127       | Momentary |
| BT 14  | 11           | Note | 61          | C#3       | 0         | 127       | Momentary |
| BT 15  | 11           | Note | 62          | D3        | 0         | 127       | Momentary |
| BT 16  | 11           | Note | 63          | D#3       | 0         | 127       | Momentary |

---

## FADER

### Main Fader (FD 1) - Both Layers
| Control | MIDI Channel | Type | CC Number | Min Value | Max Value | Notes |
|---------|--------------|------|-----------|-----------|-----------|-------|
| Fader   | 11           | CC   | CC9       | 0         | 127       | Same CC9 on both Layer A and Layer B |

---

## LED CONTROL (RX MIDI - Incoming Control)

### LED Ring Control (Encoders)
- **Behavior Control**: CC01-CC08 (Global Channel)
  - 0 = Single
  - 1 = Pan  
  - 2 = Fan
  - 3 = Spread
  - 4 = Trim
  - 5-127 = ignored

- **Value Control**: CC09-CC16 (Global Channel)
  - 0 = all LEDs off
  - 1-13 = LEDs 1 (left) – 13 (right) on
  - 14-26 = LEDs 1 (left) – 13 (right) blinking
  - 27 = all LEDs on
  - 28 = all LEDs blinking
  - 29-127 = ignored

### Button LED Control
- **Upper Row**: Note 0 – Note 7 (Global Channel)
- **Lower Row**: Note 8 – Note 15 (Global Channel)
- **LED States**:
  - Note Off or Note On with Velocity 0: Button LED off
  - Note On with Velocity 1: Button LED on
  - Note On with Velocity 2: Button LED blinking
  - Note On with Velocity 3-127: ignored

**Note**: LED control notes match the input note numbers for this device configuration.

---

## LAYER/PRESET CONTROL

### Layer Selection (RX MIDI)
- **Command**: Program Change (Global Channel)
- **Values**:
  - 0 = Layer A, A-button LED on
  - 1 = Layer B, B-button LED on
  - 2-127 = ignored
- **Note**: Only works in Standard Mode

### Mode Selection (RX MIDI)
- **Command**: CC 127 (Global Channel)
- **Values**:
  - 0 = Standard Mode, MC Mode LED off
  - 1 = MC Mode, MC Mode LED on
  - 2-127 = ignored

---

## MC MODE (Mackie Control)

### Device Configuration
- **Primary MIDI Channel**: 1 (Channel 0 in 0-based indexing)
- **Fader MIDI Channel**: 9 (Channel 8 in 0-based indexing) 
- **Layer A/B Buttons**: ✅ Available with MIDI output
- **LED Control**: Full control via MIDI (no firmware interference)

### ENCODERS (EN 1-8) - MC Mode

#### Push Function (Encoder Press)
| Encoder | MIDI Channel | Type | Note Number | Min Value | Max Value | Behavior |
|---------|--------------|------|-------------|-----------|-----------|----------|
| EN 1    | 1            | Note | 32          | 0         | 127       | Momentary |
| EN 2    | 1            | Note | 33          | 0         | 127       | Momentary |
| EN 3    | 1            | Note | 34          | 0         | 127       | Momentary |
| EN 4    | 1            | Note | 35          | 0         | 127       | Momentary |
| EN 5    | 1            | Note | 36          | 0         | 127       | Momentary |
| EN 6    | 1            | Note | 37          | 0         | 127       | Momentary |
| EN 7    | 1            | Note | 38          | 0         | 127       | Momentary |
| EN 8    | 1            | Note | 39          | 0         | 127       | Momentary |

#### Turn Function (Encoder Rotation)
| Encoder | MIDI Channel | Type | CC Number | Min Value | Max Value | Behavior |
|---------|--------------|------|-----------|-----------|-----------|----------|
| EN 1    | 1            | CC   | CC16      | 0         | 127       | Relative/Absolute |
| EN 2    | 1            | CC   | CC17      | 0         | 127       | Relative/Absolute |
| EN 3    | 1            | CC   | CC18      | 0         | 127       | Relative/Absolute |
| EN 4    | 1            | CC   | CC19      | 0         | 127       | Relative/Absolute |
| EN 5    | 1            | CC   | CC20      | 0         | 127       | Relative/Absolute |
| EN 6    | 1            | CC   | CC21      | 0         | 127       | Relative/Absolute |
| EN 7    | 1            | CC   | CC22      | 0         | 127       | Relative/Absolute |
| EN 8    | 1            | CC   | CC23      | 0         | 127       | Relative/Absolute |

### BUTTONS (BT 1-16) - MC Mode

#### Upper Row (BT 1-8)
| Button | MIDI Channel | Type | Note Number | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|----------|
| BT 1   | 1            | Note | 89          | 0         | 127       | Momentary |
| BT 2   | 1            | Note | 90          | 0         | 127       | Momentary |
| BT 3   | 1            | Note | 40          | 0         | 127       | Momentary |
| BT 4   | 1            | Note | 41          | 0         | 127       | Momentary |
| BT 5   | 1            | Note | 42          | 0         | 127       | Momentary |
| BT 6   | 1            | Note | 43          | 0         | 127       | Momentary |
| BT 7   | 1            | Note | 44          | 0         | 127       | Momentary |
| BT 8   | 1            | Note | 45          | 0         | 127       | Momentary |

#### Lower Row (BT 9-16)
| Button | MIDI Channel | Type | Note Number | Min Value | Max Value | Behavior |
|--------|--------------|------|-------------|-----------|-----------|----------|
| BT 9   | 1            | Note | 87          | 0         | 127       | Momentary |
| BT 10  | 1            | Note | 88          | 0         | 127       | Momentary |
| BT 11  | 1            | Note | 91          | 0         | 127       | Momentary |
| BT 12  | 1            | Note | 92          | 0         | 127       | Momentary |
| BT 13  | 1            | Note | 86          | 0         | 127       | Momentary |
| BT 14  | 1            | Note | 93          | 0         | 127       | Momentary |
| BT 15  | 1            | Note | 94          | 0         | 127       | Momentary |
| BT 16  | 1            | Note | 95          | 0         | 127       | Momentary |

### LAYER BUTTONS - MC Mode
| Button  | MIDI Channel | Type | Note Number | Min Value | Max Value | Behavior |
|---------|--------------|------|-------------|-----------|-----------|----------|
| Layer A | 1            | Note | 84          | 0         | 127       | Momentary |
| Layer B | 1            | Note | 85          | 0         | 127       | Momentary |

### FADER - MC Mode
| Control | MIDI Channel | Type | Data Format | Range | Notes |
|---------|--------------|------|-------------|-------|-------|
| Fader   | 9            | Pitch Bend | 14-bit | 0-16383 | MSB=Data2, LSB=Data1 |

### LED CONTROL - MC Mode
- **Full LED Control**: Available via MIDI output on Channel 1
- **Button LEDs**: Send Note On/Off to same note numbers as inputs
- **LED Ring Control**: Send CC messages to encoder-specific controllers
- **No Firmware Interference**: Complete control over all LED states

---

## DEVICE MODES COMPARISON

| Feature | Standard Mode | MC Mode |
|---------|---------------|---------|
| **Primary Channel** | 11 | 1 |
| **Layer A/B Buttons** | ❌ No MIDI | ✅ Notes 84/85 |
| **LED Control** | Limited/Hardware | ✅ Full MIDI Control |
| **Fader Type** | CC9 | Pitch Bend (Ch 9) |
| **Encoder Notes** | 16-23 | 32-39 |
| **Button Layout** | Sequential (0-15) | Non-Sequential (Mixed) |
| **Customization** | Limited | ✅ Full Control |
| **Recommended For** | Basic Use | ✅ Advanced Scripting |

---

## MIDI IMPLEMENTATION NOTES

### Standard Mode
1. **Default Channel**: All controls transmit on MIDI Channel 11
2. **Global Channel**: Can be configured (default CH 12) for receiving LED control commands
3. **Note Numbers**: Using simple numeric notation (0-23)
4. **Encoder Behavior**: Endless encoders with absolute CC output (0-127)
5. **Button Behavior**: Momentary contact (Note On when pressed, Note Off when released)
6. **LED Feedback**: Limited control via Global Channel
7. **Layer Limitation**: A/B buttons do not send MIDI

### MC Mode (Recommended)
1. **Primary Channel**: All controls transmit on MIDI Channel 1
2. **Fader Channel**: Fader uses Pitch Bend on Channel 9
3. **Note Numbers**: Non-sequential pattern optimized for Mackie Control protocol
4. **Encoder Behavior**: Endless encoders with relative/absolute CC output
5. **Button Behavior**: Momentary contact with full MIDI control
6. **LED Feedback**: Complete control via Channel 1 - no firmware interference
7. **Layer Buttons**: A/B buttons fully functional (Notes 84/85)
8. **Hardware Configuration**: Values confirmed from actual X-Touch Mini in MC Mode

---

## Hardware Specifications
- **USB Connection**: Mini-B connector
- **Power**: USB bus-powered (5V, max 1.26W)
- **Dimensions**: 47.0 x 325.0 x 102.0 mm
- **Weight**: 0.5 kg

---

## USAGE RECOMMENDATIONS

### For Controller Scripting
- **Use MC Mode** for maximum flexibility and control
- **Layer A/B buttons** provide true dual-layer functionality
- **Full LED control** enables rich visual feedback
- **No firmware interference** ensures predictable behavior

### For Basic MIDI Control
- **Standard Mode** works for simple applications
- **Limited to 16 buttons** (no Layer A/B)
- **Hardware LED behavior** may conflict with script control

---

*Generated from X-Touch Editor v1.21 and actual hardware testing in both Standard and MC modes*
