# X-Touch Mini Dual - Implementation Plan

## Overview

This document outlines a step-by-step implementation plan for the X-Touch Mini Dual controller script. The plan is designed for incremental development with constant testing phases to ensure each component works correctly before moving to the next.

## Development Phases

### Phase 1: Foundation Setup ✅ (Already Complete)
**Goal**: Establish basic MIDI communication and structure

**Current Status**: 
- ✅ Basic MIDI I/O setup
- ✅ Layer detection and switching
- ✅ MIDI message parsing and routing
- ✅ Debug logging infrastructure
- ✅ LED control functions (basic)

**What's Already Working**:
- MIDI input/output on correct channels
- Layer A/B detection based on incoming MIDI
- Basic handler functions for encoders, buttons, fader
- LED ring and button LED control functions

---

### Phase 2: Track Pinning and Group Detection
**Goal**: Implement track pinning system and group track detection

#### Step 2.1: Basic Track Bank Setup
**Tasks**:
- [ ] Create pinned track bank with configurable index
- [ ] Implement group track detection logic
- [ ] Add track existence validation
- [ ] Create debug logging for track status

**Testing**:
- Navigate to different tracks in Bitwig
- Verify controller stays pinned to configured track
- Test with both group and non-group tracks
- Check debug output shows correct track information

**Expected Behavior**:
- Controller remains focused on pinned track regardless of cursor position
- Clear logging indicates whether pinned track is a group track
- Script handles missing or invalid tracks gracefully

#### Step 2.2: Child Track Cursor Setup
**Tasks**:
- [ ] Create cursor tracks for Child Track 0 and Child Track 1
- [ ] Implement child track navigation within group
- [ ] Add child track existence validation
- [ ] Set up proper track naming and identification

**Testing**:
- Create a group track with 2+ child tracks
- Verify cursor tracks correctly target child tracks
- Test with groups having different numbers of child tracks
- Check child track names appear correctly in logs

**Expected Behavior**:
- Child track cursors automatically navigate to first two tracks in group
- Script detects when child tracks exist or are missing
- Child track names are properly identified and logged

---

### Phase 3: Remote Control Page Setup
**Goal**: Implement pinned remote control pages for all tracks

#### Step 3.1: Group Track Remote Controls
**Tasks**:
- [ ] Create Remote Control Page 4 for group track (fader)
- [ ] Pin page index to prevent automatic switching
- [ ] Add parameter existence observers
- [ ] Implement parameter value observers

**Testing**:
- Map parameters to Remote Control Page 4 on group track
- Move fader and verify parameter changes
- Test page pinning (manual page switching should not affect control)
- Verify parameter observers trigger correctly

**Expected Behavior**:
- Fader consistently controls Page 4 parameters
- Page remains pinned even when user switches pages manually
- Parameter changes are detected and logged

#### Step 3.2: Child Track Remote Controls
**Tasks**:
- [ ] Create Remote Control Pages 0, 1, 2 for Child Track 0
- [ ] Create Remote Control Pages 0, 1, 2 for Child Track 1
- [ ] Pin all page indices to prevent switching
- [ ] Set up parameter observers for all pages

**Testing**:
- Map parameters to all remote control pages for both child tracks
- Test encoder control (should map to Page 0)
- Test button control in different layers
- Verify page pinning works for all pages

**Expected Behavior**:
- Each remote control page stays pinned to its designated index
- Parameters are properly mapped and controllable
- Page switching in Bitwig UI doesn't affect controller behavior

---

### Phase 4: Encoder Implementation
**Goal**: Implement encoder control with LED feedback

#### Step 4.1: Basic Encoder Control
**Tasks**:
- [ ] Map Encoders 1-4 to Child Track 0 Page 0
- [ ] Map Encoders 5-8 to Child Track 1 Page 0  
- [ ] Implement parameter value setting
- [ ] Add encoder turn detection and handling

**Testing**:
- Turn each encoder and verify correct parameter changes
- Test with different parameter types (continuous, stepped, etc.)
- Verify layer independence (same behavior in Layer A and B)
- Check parameter ranges and scaling

**Expected Behavior**:
- Each encoder consistently controls its assigned parameter
- Parameter values change smoothly with encoder movement
- Control works identically in both layers

#### Step 4.2: Encoder LED Rings
**Tasks**:
- [ ] Implement LED ring value updates
- [ ] Set appropriate LED ring behavior for parameter types
- [ ] Add real-time LED feedback
- [ ] Handle parameter existence states in LED display

**Testing**:
- Verify LED rings show current parameter values
- Test LED updates when parameters change from other sources
- Check LED behavior with different parameter types
- Test LED state when parameters don't exist

**Expected Behavior**:
- LED rings accurately reflect parameter values
- LEDs update in real-time as parameters change
- Different parameter types use appropriate ring behaviors
- Missing parameters show no LED activity

---

### Phase 5: Fader Implementation
**Goal**: Implement fader control for group track

#### Step 5.1: Basic Fader Control
**Tasks**:
- [ ] Map fader to Group Track Remote Control Page 4
- [ ] Implement parameter value setting from fader input
- [ ] Add fader movement detection and handling
- [ ] Test fader scaling and resolution

**Testing**:
- Move fader and verify Group Track Page 4 parameter changes
- Test fader resolution and smoothness
- Verify layer independence
- Check parameter scaling matches fader range

**Expected Behavior**:
- Fader smoothly controls Group Track Page 4 parameters
- Full fader range maps to full parameter range
- Control works identically in both layers

---

### Phase 6: Lower Button Implementation  
**Goal**: Implement always-active lower button control

#### Step 6.1: Basic Lower Button Control
**Tasks**:
- [ ] Map Lower Buttons 1-4 to Child Track 0 Page 2
- [ ] Map Lower Buttons 5-8 to Child Track 1 Page 2
- [ ] Implement button press handling
- [ ] Add parameter toggling logic

**Testing**:
- Press each lower button and verify parameter changes
- Test with different parameter types (toggle, momentary, etc.)
- Verify layer independence
- Check button press/release handling

**Expected Behavior**:
- Lower buttons consistently control Page 2 parameters
- Button behavior appropriate for parameter type
- Works identically in both layers

#### Step 6.2: Lower Button LED Feedback
**Tasks**:
- [ ] Implement LED updates for lower button parameters
- [ ] Add real-time LED feedback
- [ ] Handle different parameter states in LED display
- [ ] Set appropriate LED colors/brightness

**Testing**:
- Verify button LEDs reflect parameter states
- Test LED updates when parameters change from other sources
- Check LED behavior with different parameter types
- Test LED state when parameters don't exist

**Expected Behavior**:
- Button LEDs accurately show parameter states
- LEDs update in real-time
- Appropriate visual feedback for different parameter types

---

### Phase 7: Upper Button Layer A Implementation
**Goal**: Implement upper button control for Layer A (Remote Control Page 1)

#### Step 7.1: Layer A Upper Button Control
**Tasks**:
- [ ] Map Upper Buttons 1-4 to Child Track 0 Page 1 (Layer A only)
- [ ] Map Upper Buttons 5-8 to Child Track 1 Page 1 (Layer A only)
- [ ] Implement layer-aware button handling
- [ ] Add parameter control logic

**Testing**:
- Switch to Layer A and test upper button control
- Verify buttons control Page 1 parameters
- Switch to Layer B and verify upper buttons don't affect Page 1
- Test parameter toggling and different parameter types

**Expected Behavior**:
- Upper buttons control Page 1 only when in Layer A
- No Page 1 parameter changes when in Layer B
- Proper parameter toggling behavior

#### Step 7.2: Layer A Upper Button LEDs
**Tasks**:
- [ ] Implement LED feedback for Layer A upper buttons
- [ ] Add layer-aware LED updates
- [ ] Handle parameter state display
- [ ] Ensure LEDs turn off when not in Layer A

**Testing**:
- Verify LEDs show correct states in Layer A
- Check LEDs turn off when switching to Layer B
- Test LED updates from parameter changes
- Verify LED behavior with missing parameters

**Expected Behavior**:
- LEDs active and accurate in Layer A
- LEDs inactive in Layer B
- Real-time LED updates

---

### Phase 8: MIDI Clip Launcher Implementation (Layer B)
**Goal**: Implement MIDI clip launching for Layer B upper buttons

#### Step 8.1: Clip Launcher Setup
**Tasks**:
- [ ] Create clip launcher slot banks for both child tracks
- [ ] Set up clip slot observers (hasContent, isPlaying, etc.)
- [ ] Implement clip existence detection
- [ ] Add clip launcher bank setup

**Testing**:
- Create MIDI clips in child track slots
- Verify clip detection and state observation
- Test with different numbers of clips
- Check clip state changes are detected

**Expected Behavior**:
- Script correctly detects clip presence
- Clip playing states are properly observed
- Works with varying numbers of clips

#### Step 8.2: Layer B Clip Launching
**Tasks**:
- [ ] Map Upper Buttons 1-4 to Child Track 0 clips 0-3 (Layer B only)
- [ ] Map Upper Buttons 5-8 to Child Track 1 clips 0-3 (Layer B only)
- [ ] Implement clip launch/stop logic
- [ ] Add layer-aware clip control

**Testing**:
- Switch to Layer B and test clip launching
- Verify clips launch and stop correctly
- Test with empty clip slots
- Switch to Layer A and verify no clip interaction

**Expected Behavior**:
- Upper buttons launch/stop clips only in Layer B
- Empty slots don't respond to button presses
- No clip control in Layer A

#### Step 8.3: Layer B Clip LEDs
**Tasks**:
- [ ] Implement LED feedback for clip states
- [ ] Add different colors for playing/stopped/empty states
- [ ] Ensure layer-aware LED behavior
- [ ] Handle real-time clip state changes

**Testing**:
- Verify LED colors match clip states (playing/stopped/empty)
- Test LED updates when clips start/stop from other sources
- Check LEDs in Layer A vs Layer B
- Test LED behavior with clip creation/deletion

**Expected Behavior**:
- LEDs show appropriate colors for clip states
- Real-time updates as clips change
- LEDs only active for clips in Layer B

---

### Phase 9: Integration and Polish
**Goal**: Final integration, optimization, and user experience improvements

#### Step 9.1: Layer Management
**Tasks**:
- [ ] Implement smooth layer switching
- [ ] Add layer state persistence
- [ ] Optimize layer detection logic
- [ ] Add layer indication (if possible)

**Testing**:
- Test rapid layer switching
- Verify layer state is maintained correctly
- Check layer detection accuracy
- Test edge cases in layer switching

**Expected Behavior**:
- Smooth, reliable layer switching
- Clear indication of current layer
- No glitches during layer changes

#### Step 9.2: Error Handling and Validation
**Tasks**:
- [ ] Add comprehensive error handling
- [ ] Implement graceful degradation for missing tracks
- [ ] Add parameter validation
- [ ] Improve error logging and user feedback

**Testing**:
- Test with non-group tracks
- Test with missing child tracks
- Test with empty remote control pages
- Test MIDI disconnection scenarios

**Expected Behavior**:
- Script handles errors gracefully
- Clear error messages in logs
- Partial functionality when some components missing

#### Step 9.3: Performance Optimization
**Tasks**:
- [ ] Optimize observer management
- [ ] Reduce unnecessary MIDI messages
- [ ] Improve LED update efficiency
- [ ] Clean up unused resources

**Testing**:
- Monitor CPU usage during operation
- Check for MIDI message flooding
- Test LED update responsiveness
- Verify clean script shutdown

**Expected Behavior**:
- Efficient resource usage
- Responsive LED feedback
- No performance issues during normal operation

---

## Testing Guidelines

### For Each Phase:
1. **Unit Testing**: Test individual components in isolation
2. **Integration Testing**: Test components working together
3. **User Testing**: Test actual workflow scenarios
4. **Edge Case Testing**: Test error conditions and unusual scenarios

### Test Environment Setup:
1. Create a test project with appropriate group track setup
2. Map various parameter types to remote control pages
3. Create test MIDI clips for clip launcher testing
4. Have both simple and complex track configurations ready

### Regression Testing:
- After each phase, re-test previous phases to ensure no regressions
- Maintain a test checklist for quick validation
- Document any discovered issues and their solutions

## Success Criteria

### Phase Completion Criteria:
- All tasks in phase completed
- All tests passing
- No critical bugs or issues
- Code properly documented and logged
- Ready for user testing

### Overall Project Success:
- All specified functionality working correctly
- Reliable operation in various scenarios
- Good user experience and responsiveness
- Proper error handling and recovery
- Clean, maintainable code structure

## Risk Mitigation

### Potential Issues:
1. **MIDI Communication Problems**: Test thoroughly with different hardware configurations
2. **Track Detection Issues**: Implement robust validation and fallback mechanisms  
3. **Performance Problems**: Monitor resource usage and optimize as needed
4. **User Experience Issues**: Get feedback early and iterate on design

### Mitigation Strategies:
- Incremental development with constant testing
- Comprehensive logging for debugging
- Graceful degradation for missing components
- Clear documentation and user guidance
