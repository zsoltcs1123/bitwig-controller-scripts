# X-Touch Mini Single MC Mode Controller Script

A comprehensive Bitwig Studio controller script for the Behringer X-Touch Mini in MC (Mackie Control) mode, implementing single child track control with mutually exclusive layer switching between two child tracks.

## 🎛️ Features

### **Single Track Control with Layer Switching**
- **Layer A**: Controls Child Track 0 exclusively
- **Layer B**: Controls Child Track 1 exclusively
- **Mutually Exclusive**: Only one layer can be active at a time
- **Full Control**: All 8 encoders and buttons dedicated to the active track

### **Control Mapping**

#### **Layer A Active (Child Track 0)**
- **Encoders 1-5**: Child Track 0 Primary Device Page 0 parameters (0-4)
- **Encoders 6-8**: Group track parameters tagged with 'send1' (0-2)
- **Upper Buttons 1-4**: Child Track 0 instrument chain selection (chains 0-3)
- **Upper Buttons 5-8**: Child Track 0 clip launcher (slots 0-3)
- **Lower Buttons 1-8**: Child Track 0 mute parameters 0-7 (tagged with 'mutes')
- **Fader**: Group track parameter tagged with 'fader'

#### **Layer B Active (Child Track 1)**
- **Encoders 1-5**: Child Track 1 Primary Device Page 0 parameters (0-4)
- **Encoders 6-8**: Group track parameters tagged with 'send2' (0-2)
- **Upper Buttons 1-4**: Child Track 1 instrument chain selection (chains 0-3)
- **Upper Buttons 5-8**: Child Track 1 clip launcher (slots 0-3)
- **Lower Buttons 1-8**: Child Track 1 mute parameters 0-7 (tagged with 'mutes')
- **Fader**: Group track parameter tagged with 'fader'

### **Layer Switching**
- **Layer A Button**: Switch to Child Track 0 control
- **Layer B Button**: Switch to Child Track 1 control
- **Mutually Exclusive**: Pressing one layer button deactivates the other
- **LED Feedback**: Active layer button is lit, inactive layer button is off
- **Instant Update**: All LEDs (encoders, buttons) update immediately when switching layers

### **LED Feedback**
- **Real-time parameter feedback**: LED rings show encoder parameter values for active track
- **Instrument selection feedback**: Upper buttons 1-4 LEDs show active instrument chain for active track
- **Clip launcher feedback**: Upper buttons 5-8 LEDs show clip states (playing/stopped) for active track
- **Mute parameter feedback**: Lower buttons 1-8 LEDs show mute states for active track
- **Layer indicators**: Layer A and Layer B buttons show which layer is active
- **Dynamic updates**: All LEDs update when switching instruments or layers

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
2. **Child Track 0**: First child track within the group (Layer A)
3. **Child Track 1**: Second child track within the group (Layer B)

### **Parameter Tagging (CRITICAL)**
For the advanced functionality to work, you must tag your device parameters in Bitwig:

#### **Mute Parameters**
- Tag parameters you want to control with the lower 8 buttons as **'mutes'**
- Parameters 0-7 will map to lower buttons 1-8
- These parameters are typically instrument mutes in a drum machine or sampler

#### **Send Parameters**
- Tag parameters you want to control with encoders 6-8 on Layer A as **'send1'**
- Tag parameters you want to control with encoders 6-8 on Layer B as **'send2'**
- Parameters 0-2 will map to encoders 6-8 respectively
- These parameters are typically send levels or effects parameters

#### **Fader Parameter**
- Tag the parameter you want the fader to control as **'fader'**

### **How to Tag Parameters in Bitwig**
1. Right-click on a device parameter
2. Select "Configure Remote Control"
3. In the remote control page, add tags to parameters
4. Use exactly **'mutes'** for mute controls, **'send1'**/**'send2'** for send controls, and **'fader'** for fader control

## 🚀 Installation

1. Copy the entire `xtm-single-mc` folder to your Bitwig Controller Scripts directory:
   - **Windows**: `%USERPROFILE%/Documents/Bitwig Studio/Controller Scripts/`
   - **macOS**: `~/Documents/Bitwig Studio/Controller Scripts/`
   - **Linux**: `~/Bitwig Studio/Controller Scripts/`

2. In Bitwig Studio:
   - Go to **Settings → Controllers**
   - Click **Add controller**
   - Select **Behringer → X-Touch Mini Single 6 MC Mode**
   - Configure MIDI input/output to your X-Touch Mini

## 🎵 Usage Workflow

### **Basic Operation**
1. **Start with Layer A**: Child Track 0 is active by default
2. **Control Device Parameters**: Use encoders 1-5 for device parameters
3. **Control Send Parameters**: Use encoders 6-8 for group track send parameters
4. **Select Instruments**: Use upper buttons 1-4 to switch between instrument chains
5. **Launch Clips**: Use upper buttons 5-8 to trigger MIDI clips
6. **Toggle Mutes**: Use lower buttons 1-8 to mute/unmute individual sounds
7. **Switch Layers**: Press Layer B button to switch to Child Track 1

### **Layer Switching Behavior**
- **Immediate Feedback**: All LEDs update instantly when switching layers
- **Parameter Continuity**: Each layer maintains its own parameter states
- **Instrument Context**: Mute LEDs reflect the currently selected instrument
- **Visual Clarity**: Active layer button is always lit

### **Advanced Features**
- **Instrument-Aware Mutes**: When you switch instruments, mute LEDs update to show the new instrument's mute states
- **Real-time LED Rings**: Encoder LED rings always show current parameter values
- **Clip State Feedback**: Clip launcher buttons show playing/stopped states
- **Error Handling**: Graceful behavior when tracks or devices are unavailable

## 🔍 Key Differences from Dual Version

### **Control Philosophy**
- **Dual Version**: Simultaneous control of both tracks (4+4 split)
- **Single Version**: Full control of one track at a time (5+3 split: 5 device + 3 send parameters)

### **Layer System**
- **Dual Version**: Independent layers (both can be active simultaneously)
- **Single Version**: Mutually exclusive layers (only one active at a time)

### **Button Mapping**
- **Dual Version**: Split functionality across tracks
- **Single Version**: Full functionality dedicated to active track

### **LED Updates**
- **Dual Version**: Partial LED updates based on layer state
- **Single Version**: Complete LED refresh when switching layers

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

#### **Layer Switching LED Updates**
**Solution**: Comprehensive LED update function:
```javascript
function updateAllLEDsForActiveLayer() {
    updateEncoderLEDRingsForActiveLayer();
    updateUpperButtonLEDsForActiveLayer();
    updateLowerButtonLEDsForActiveLayer();
}
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
- Layer switching events
- LED updates
- Error conditions

## 📝 Development Notes

### **Code Structure**
- **Modular design**: Separate functions for each control type
- **Layer management**: Mutually exclusive Layer A and Layer B system  
- **LED feedback**: Complete LED refresh system for layer switching
- **Error handling**: Graceful degradation when hardware/tracks unavailable

### **Performance Optimizations**
- **Efficient LED updates**: Complete refresh only when switching layers
- **Smart observers**: Conditional LED updates based on active layer
- **Streamlined logging**: Concise debug messages for production use

## 🤝 Contributing

This script demonstrates advanced Bitwig API usage and hardware integration. Key learnings can be applied to other controller development projects.

## 📄 License

This controller script is provided as-is for educational and practical use with Bitwig Studio and the Behringer X-Touch Mini.

---

**Version**: 1.0  
**Bitwig API**: v25  
**Hardware**: Behringer X-Touch Mini (MC Mode)  
**Author**: Zsolt
