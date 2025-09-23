# Behringer X-Touch Mini - MC Mode Controller Script

## Overview

This is a Bitwig Studio 6 controller script for the Behringer X-Touch Mini USB controller running in **MC (Mackie Control) Mode**. This script provides dual-layer functionality with full hardware LED control and support for multiple controller instances.

## Files

- **`xtm-dual.control.js`** - MC Mode controller script with dual-layer support
- **`package.json`** - Controller metadata for Bitwig Studio
- **`create-multiple-controllers.ps1`** - PowerShell script for creating multiple controller instances

## Controller Script Features

### ✅ **Dual-Layer Functionality**
- **Layer A & Layer B** switching via dedicated hardware buttons
- **18 Total Controls** per layer (8 encoders + 8 upper buttons + 8 lower buttons + fader)
- **Full LED Feedback** for visual status indication

### ✅ **Hardware Support**
- **8 Push Encoders** with LED rings
- **16 Buttons** (2 rows of 8) with LED backlights  
- **1 Fader** (60mm)
- **2 Layer Buttons** (A/B) - Hardware layer switching
- **Complete LED Control** - Full hardware LED feedback

## Setup Instructions

### 1. Hardware Configuration

**IMPORTANT:** This controller script requires **MC (Mackie Control) Mode** for full functionality including hardware layer switching.

#### Setting MC Mode:
1. Open the **X-Touch Editor** software
2. Set **Mode** to **MC** (Mackie Control)
3. Click **"To Hardware"** to upload the configuration
4. The **MC MODE LED** on the controller should be ON

#### Why MC Mode?
- ✅ **Hardware layer buttons** (A/B) send MIDI and work natively
- ✅ **Complete LED control** with hardware feedback
- ✅ **Mackie Control protocol** for professional DAW integration
- ✅ **Fixed MIDI channels** for consistent behavior

### 2. Bitwig Configuration

1. **Add Controller** in Bitwig Settings → Controllers
2. **Select:** "Behringer X-Touch Mini Dual MC - Controller 1"
3. **Configure MIDI Ports** to match your X-Touch Mini
4. **Test all controls** - check console for debug output
5. **Verify layer buttons** work for A/B switching

### 3. MIDI Channel Information

**MC Mode Fixed Channels:**
- **Primary Controls:** Channel 1 (encoders, buttons, layer switches)
- **Fader:** Channel 9 (pitch bend)
- **LED Output:** Channel 1

**Note:** These channels are fixed by the Mackie Control protocol and cannot be changed via hardware settings.

## Multiple Controller Support

### The Challenge

All X-Touch Mini controllers in MC mode transmit on the **same MIDI channels** (1 & 9). This creates conflicts when using multiple controllers simultaneously.

### Solution: Virtual MIDI Routing

To use multiple X-Touch Mini controllers, you need **MIDI routing software** to separate them onto different channels:

#### Recommended MIDI Routing Software:
- **Windows:** loopMIDI + MIDI-OX, Bome MIDI Translator Pro
- **macOS:** MIDI Patchbay, SoundDesk  
- **Cross-Platform:** rtpMIDI, QjackCtl

#### Example Setup (3 Controllers):
```
Physical Controller 1 → Virtual Port 1 → Channels 1,9   (Script: Controller 1)
Physical Controller 2 → Virtual Port 2 → Channels 2,10  (Script: Controller 2)  
Physical Controller 3 → Virtual Port 3 → Channels 3,11  (Script: Controller 3)
```

### Creating Multiple Script Instances

Use the provided PowerShell script to generate multiple controller versions:

```powershell
# Run from this directory (xtm-dual-mc)
powershell -ExecutionPolicy Bypass -File "create-multiple-controllers.ps1" -NumControllers 3
```

This creates:
- `xtm-dual-mc/` - Controller 1 (Channels 1,9) - Original
- `xtm-dual-mc-2/` - Controller 2 (Channels 2,10) - Generated
- `xtm-dual-mc-3/` - Controller 3 (Channels 3,11) - Generated

Each script has unique names and UUIDs for Bitwig recognition.

## MIDI Implementation

### Complete Reference

For detailed MIDI implementation documentation, see the parent directory's reference files:
- `../x-touch-mini-midi-reference.md` - Complete MIDI mappings and LED control
- `../x-touch quick start.md` - Official Behringer documentation

### Quick Reference (MC Mode)

| Control | MIDI Channel | Type | Range | Notes |
|---------|--------------|------|-------|-------|
| Encoders 1-8 (Turn) | 1 | CC16-23 | 0-127 | Relative/Absolute |
| Encoders 1-8 (Push) | 1 | Note 32-39 | 0-127 | Momentary |
| Upper Buttons 1-8 | 1 | Note 89,90,40-45 | 0-127 | Non-sequential |
| Lower Buttons 1-8 | 1 | Note 87,88,91-95 | 0-127 | Non-sequential |
| Layer A Button | 1 | Note 84 | 0-127 | Available in MC Mode |
| Layer B Button | 1 | Note 85 | 0-127 | Available in MC Mode |
| Fader | 9 | Pitch Bend | 0-16383 | 14-bit resolution |

## Troubleshooting

### Controller Not Detected
- ✅ Ensure X-Touch Mini is in **MC Mode** (MC LED should be ON)
- ✅ Restart Bitwig after script installation
- ✅ Verify MIDI ports in Bitwig controller settings
- ✅ Check USB connection and driver installation

### Layer Buttons Not Working
- ✅ Confirm controller is in **MC Mode** (not Standard Mode)
- ✅ Verify Layer A/B buttons are mapped correctly in script
- ✅ Check MIDI monitor for Note 84 (Layer A) and Note 85 (Layer B)

### Multiple Controllers Conflict
- ❌ All X-Touch Mini controllers in MC Mode use the same MIDI channels
- ✅ Use MIDI routing software to separate controllers onto different channels
- ✅ Create multiple script instances with `create-multiple-controllers.ps1`
- ✅ Configure virtual MIDI ports for each physical controller

### LED Control Issues
- ✅ MC Mode provides automatic LED feedback for many controls
- ✅ Custom LED control requires proper MIDI channel 1 output
- ✅ Some LEDs are controlled directly by hardware in MC Mode

## Development

### Script Structure
- **MC Mode optimized** for maximum hardware integration
- **Dual-layer architecture** with hardware A/B button support
- **Modular design** - easy to customize for different use cases
- **Comprehensive debugging** - enable with `DEBUG = true`

### Customization
- Modify MIDI channel constants for multiple controller support
- Extend functionality in control handler functions
- LED control functions available for custom visual feedback
- Hardware layer switching can be extended for more complex workflows

## Version History

- **v1.0.0** - MC Mode implementation with dual-layer hardware support
- **v0.1.0** - Initial development and hardware testing
- Multiple controller support framework with PowerShell automation

## License

Created for Bitwig Studio 6 controller scripting. Free to use and modify.

---

**Author:** Zsolt  
**Bitwig API:** Version 25  
**Hardware:** Behringer X-Touch Mini (Firmware 1.10)  
**Editor:** X-Touch Editor v1.21
