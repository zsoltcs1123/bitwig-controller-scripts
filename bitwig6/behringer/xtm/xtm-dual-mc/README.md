# X-Touch Mini Dual MC Mode Controller Script

A comprehensive Bitwig Studio controller script for the Behringer X-Touch Mini in MC (Mackie Control) mode, implementing dual child track control with advanced layer switching functionality.

## 🎛️ Features

### **Dual Child Track Control**
- **Child Track 0**: Controlled via encoders 1-4, upper buttons 1-4, lower buttons 1-4
- **Child Track 1**: Controlled via encoders 5-8, upper buttons 5-8, lower buttons 5-8
- **Independent Layer System**: Layer A and Layer B can be active simultaneously

### **Control Mapping**

#### **Normal Operation (No Layers Active)**
- **Encoders 1-4**: Child Track 0 Primary Device Page 0 parameters
- **Encoders 5-8**: Child Track 1 Primary Device Page 0 parameters
- **Upper Buttons 1-4**: Child Track 0 instrument chain selection
- **Upper Buttons 5-8**: Child Track 1 instrument chain selection
- **Lower Buttons 1-4**: Child Track 0 clip launcher (slots 0-3)
- **Lower Buttons 5-8**: Child Track 1 clip launcher (slots 0-3)
- **Fader**: Group track parameter tagged with 'fader'

#### **Layer A Active (Layer A Button ON)**
- **Encoders 1-4**: Still control Child Track 0 Primary Device Page 0
- **Upper Buttons 1-4**: Child Track 0 mute parameters 0-3 (tagged with 'mutes')
- **Lower Buttons 1-4**: Child Track 0 mute parameters 4-7 (tagged with 'mutes')
- **Other controls**: Unchanged

#### **Layer B Active (Layer B Button ON)**
- **Encoders 5-8**: Still control Child Track 1 Primary Device Page 0
- **Upper Buttons 5-8**: Child Track 1 mute parameters 0-3 (tagged with 'mutes')
- **Lower Buttons 5-8**: Child Track 1 mute parameters 4-7 (tagged with 'mutes')
- **Other controls**: Unchanged

### **LED Feedback**
- **Real-time parameter feedback**: LED rings show encoder parameter values
- **Instrument selection feedback**: Upper button LEDs show active instrument chains
- **Clip launcher feedback**: Lower button LEDs show clip states (playing/stopped)
- **Layer mode feedback**: Button LEDs switch to show mute parameter states when layers are active
- **Layer button indicators**: Layer A and Layer B buttons light up when active

## 🔧 Hardware Setup

### **X-Touch Mini Configuration**
1. Set the X-Touch Mini to **MC Mode** (Mackie Control)
2. Use **Channel 1** for MIDI communication
3. **Fader Channel**: Channel 9 (for pitch bend messages)

### **MIDI Configuration**
- **Input MIDI Channel**: 0 (Channel 1)
- **Fader MIDI Channel**: 8 (Channel 9) 
- **Output MIDI Channel**: 0 (Channel 1)
- **LED Global Channel**: 0 (Channel 1)

## 🎯 Bitwig Studio Setup

### **Track Structure**
1. **Group Track**: Main parent track (pinned to track index 0)
2. **Child Track 0**: First child track within the group
3. **Child Track 1**: Second child track within the group

### **Parameter Tagging (CRITICAL)**
For the advanced functionality to work, you must tag your device parameters in Bitwig:

#### **Mute Parameters**
- Tag parameters you want to control with Layer A/B as **'mutes'**
- Parameters 0-3 will map to upper buttons
- Parameters 4-7 will map to lower buttons

#### **Fader Parameter**
- Tag the parameter you want the fader to control as **'fader'**

### **How to Tag Parameters in Bitwig**
1. Right-click on a device parameter
2. Select "Configure Remote Control"
3. In the remote control page, add tags to parameters
4. Use exactly **'mutes'** for mute controls and **'fader'** for fader control

## 🚀 Installation

1. Copy `xtm-dual.control.js` to your Bitwig Controller Scripts directory:
   - **Windows**: `%USERPROFILE%/Documents/Bitwig Studio/Controller Scripts/`
   - **macOS**: `~/Documents/Bitwig Studio/Controller Scripts/`
   - **Linux**: `~/Bitwig Studio/Controller Scripts/`

2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Click **Add controller**
   - Select **Behringer → X-Touch Mini Dual 6 MC Mode**
   - Configure MIDI input/output to your X-Touch Mini

## 🔍 Key Technical Findings

### **Bitwig API Discoveries**

#### **Remote Control Page Issue**
**Problem**: Using `selectedPageIndex().set()` to access different pages results in both references pointing to the same page.

**Solution**: Use `createCursorRemoteControlsPage()` with filter expressions:
```javascript
// Instead of this (broken):
page1 = device.createCursorRemoteControlsPage("Page1", 8, null);
page1.selectedPageIndex().set(1);

// Use this (working):
page1 = device.createCursorRemoteControlsPage("Page1", 8, "mutes");
```

#### **Parameter Toggle Method**
**Problem**: There is no `param.toggle()` method in the Bitwig API.

**Solution**: Manual toggle implementation:
```javascript
const currentValue = param.value().get();
const newValue = currentValue > 0 ? 0 : 127;
param.value().set(newValue, 128);
```

#### **Fader Scaling**
**Problem**: Incorrect pitch bend to parameter conversion.

**Solution**: Proper 14-bit to normalized conversion:
```javascript
const pitchBendValue = (msb << 7) | lsb;  // 0-16383
const normalizedValue = pitchBendValue / 16383.0;  // 0.0-1.0
param.set(normalizedValue);  // No resolution parameter for smooth control
```

### **Hardware Discoveries**

#### **MC Mode LED Control**
- Uses **Mackie Control Universal** protocol
- LED rings: CC48-55 with Fan mode (value + 32)
- Button LEDs: Note On messages with velocity as state
- **Velocity 0**: OFF, **Velocity 127**: ON, **Velocity 1**: BLINKING

#### **MIDI Message Patterns**
- **Encoders**: CC16-23 with relative values (1-63 clockwise, 65-127 counter-clockwise)
- **Buttons**: Non-sequential note numbers (mixed pattern)
- **Fader**: 14-bit pitch bend on Channel 9

## 🐛 Debugging

Set `DEBUG = true` in the script to enable detailed logging. The script will output:
- MIDI message details
- Parameter changes
- Layer state changes
- LED updates
- Error conditions

## 📝 Development Notes

### **Code Structure**
- **Modular design**: Separate functions for each control type
- **Layer management**: Independent Layer A and Layer B systems  
- **LED feedback**: Real-time updates with automatic switching
- **Error handling**: Graceful degradation when hardware/tracks unavailable

### **Performance Optimizations**
- **Streamlined logging**: Concise debug messages for production use
- **Efficient LED updates**: Only update when values change
- **Smart observers**: Conditional LED updates based on layer state

## 🤝 Contributing

This script demonstrates advanced Bitwig API usage and hardware integration. Key learnings can be applied to other controller development projects.

## 📄 License

This controller script is provided as-is for educational and practical use with Bitwig Studio and the Behringer X-Touch Mini.

---

**Version**: 1.0  
**Bitwig API**: v25  
**Hardware**: Behringer X-Touch Mini (MC Mode)  
**Author**: Zsolt
