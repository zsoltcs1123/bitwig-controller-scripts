================================================
FILE: XTouchMini/README.md
================================================
# Sample code for working with the X-Touch Mini

The [Behringer X-Touch
Mini](https://www.behringer.com/product.html?modelCode=P0B3M) is a
compact control surface with 8 knobs, 16 general-purpose buttons, a
fader, and 2 layer buttons.

I'm interested in using it to control a Behringer
[XR-16](https://www.behringer.com/product.html?modelCode=P0BI7) or
[XR-18](https://www.behringer.com/product.html?modelCode=P0BI8)
digital mixer, using [code already described in an earlier blog
post](https://codeblog.jonskeet.uk/2021/01/27/osc-mixer-control-in-c/)... and it turns out, that's pretty simple to do.

The code here is divided into three projects:

- XTouchMini.Model: the core controller code
- XTouchMini.Console: a simple test tool using the X-Touch Mini in
  "Standard mode"
- XTouchMini.MixerControl: a prototype of the full XR-16/18 mixer
  control, using the X-Touch Mini in "Mackie Control mode" for
  more fine-grained control over the display

All this code should be regarded as *very* much prototype code,
put together in a few hours, but hopefully of interest anyway.



================================================
FILE: XTouchMini/XTouchMini.sln
================================================
﻿
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 16
VisualStudioVersion = 16.0.31025.194
MinimumVisualStudioVersion = 15.0.26124.0
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "XTouchMini.Model", "XTouchMini.Model\XTouchMini.Model.csproj", "{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "XTouchMini.Console", "XTouchMini.Console\XTouchMini.Console.csproj", "{F29EEB2D-C55F-4225-85DC-482223B0EABC}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "XTouchMini.MixerControl", "XTouchMini.MixerControl\XTouchMini.MixerControl.csproj", "{6F9BFAF5-22AB-4245-A349-836D2D7F050D}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "OscMixerControl", "..\OscMixerControl\OscMixerControl\OscMixerControl.csproj", "{DD047634-4684-4542-932B-06F00B7A9A82}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Debug|x64 = Debug|x64
		Debug|x86 = Debug|x86
		Release|Any CPU = Release|Any CPU
		Release|x64 = Release|x64
		Release|x86 = Release|x86
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|x64.ActiveCfg = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|x64.Build.0 = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|x86.ActiveCfg = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Debug|x86.Build.0 = Debug|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|Any CPU.Build.0 = Release|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|x64.ActiveCfg = Release|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|x64.Build.0 = Release|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|x86.ActiveCfg = Release|Any CPU
		{208AFD08-A2EC-4754-A957-2D0E2FC1EB3C}.Release|x86.Build.0 = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|x64.ActiveCfg = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|x64.Build.0 = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|x86.ActiveCfg = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Debug|x86.Build.0 = Debug|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|Any CPU.Build.0 = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|x64.ActiveCfg = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|x64.Build.0 = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|x86.ActiveCfg = Release|Any CPU
		{F29EEB2D-C55F-4225-85DC-482223B0EABC}.Release|x86.Build.0 = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|x64.ActiveCfg = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|x64.Build.0 = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|x86.ActiveCfg = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Debug|x86.Build.0 = Debug|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|Any CPU.Build.0 = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|x64.ActiveCfg = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|x64.Build.0 = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|x86.ActiveCfg = Release|Any CPU
		{6F9BFAF5-22AB-4245-A349-836D2D7F050D}.Release|x86.Build.0 = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|x64.ActiveCfg = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|x64.Build.0 = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|x86.ActiveCfg = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Debug|x86.Build.0 = Debug|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|Any CPU.Build.0 = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|x64.ActiveCfg = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|x64.Build.0 = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|x86.ActiveCfg = Release|Any CPU
		{DD047634-4684-4542-932B-06F00B7A9A82}.Release|x86.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {EC4C9BA9-87D0-4530-96DB-E584B9ED9B19}
	EndGlobalSection
EndGlobal



================================================
FILE: XTouchMini/XTouchMini.Console/Program.cs
================================================
﻿using Microsoft.Extensions.Logging.Abstractions;
using System;
using System.Linq;
using System.Threading.Tasks;
using XTouchMini.Model;

namespace XTouchMini.Console
{
    class Program
    {
        static async Task Main(string[] args)
        {
            await using (var controller = await XTouchMiniStandardController.ConnectAsync(NullLogger.Instance, "X-TOUCH MINI"))
            {
                System.Console.WriteLine("Connected");
                controller.ButtonDown += (sender, args) => System.Console.WriteLine($"Button {args.Button} in {args.Layer} pressed");
                controller.ButtonUp += (sender, args) => System.Console.WriteLine($"Button {args.Button} in {args.Layer} released");

                controller.KnobDown += (sender, args) => System.Console.WriteLine($"Knob {args.Knob} in {args.Layer} pressed");
                controller.KnobUp += (sender, args) => System.Console.WriteLine($"Knob {args.Knob} in {args.Layer} released");

                controller.KnobTurned += (sender, args) => System.Console.WriteLine($"Knob {args.Knob} in {args.Layer} turned to position {args.Value}");
                controller.FaderMoved += (sender, args) => System.Console.WriteLine($"Fader {args.Layer} moved to position {args.Position}");

                controller.ButtonDown += (sender, args) =>
                {
                    int button = args.Button;
                    switch (button)
                    {
                            // Buttons 1-5 (top row) set the knob ring style
                            case >= 1 and <= 6:
                            var style = (KnobRingStyle) (button - 1);
                            System.Console.WriteLine($"Setting style to {style}");
                            for (int i = 1; i <= 8; i++)
                            {
                                controller.SetKnobRingStyle(i, style);
                            }
                            break;
                            // Buttons 9 and 10 (leftmost of bottom row) change the layer.
                            // This leaves the button lights in an odd state, but never mind.
                            case >= 9 and <= 10:
                            var layer = (Layer) (button - 8);
                            System.Console.WriteLine($"Setting active layer to {layer}");
                            controller.SetActiveLayer(layer);
                            break;
                            // Buttons 11-16 (remainder of bottom row) test various knob ring values:
                            // 11: All on
                            // 12: All blinking
                            // 13: Light 3 on
                            // 14: Light 3 blinking
                            // 15: All off (via LedState)
                            // 16: All off (via value)
                            case 11:
                            controller.SetKnobRingLights(1, LedState.On, 14);
                            break;
                        case 12:
                            controller.SetKnobRingLights(1, LedState.Blinking, 14);
                            break;
                        case 13:
                            controller.SetKnobRingLights(1, LedState.On, 3);
                            break;
                        case 14:
                            controller.SetKnobRingLights(1, LedState.Blinking, 3);
                            break;
                        case 15:
                            controller.SetKnobRingLights(1, LedState.Off, 3);
                            break;
                        case 16:
                            controller.SetKnobRingLights(1, LedState.On, 0);
                            break;
                    };

                };

                while (true)
                {
                    System.Console.WriteLine("Enter MIDI bytes (space separated):");
                    var line = System.Console.ReadLine();
                    var bytes = line.Split(' ').Select(part => Convert.ToByte(part, 16)).ToArray();
                    controller.SendMidiMessage(bytes);
                }
            }
        }
    }
}



================================================
FILE: XTouchMini/XTouchMini.Console/XTouchMini.Console.csproj
================================================
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\XTouchMini.Model\XTouchMini.Model.csproj" />
  </ItemGroup>

</Project>



================================================
FILE: XTouchMini/XTouchMini.MixerControl/ControlledChannel.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using OscMixerControl;
using System;
using System.ComponentModel;
using System.Threading.Tasks;
using XTouchMini.Model;

namespace XTouchMini.MixerControl
{
    /// <summary>
    /// Connection between an X-Touch Mini controller and a mixer channel.
    /// </summary>
    internal class ControlledChannel
    {
        private Channel mixerChannel;
        private XTouchMiniMackieController controller;

        // Knob/button index
        private int controllerIndex;

        internal ControlledChannel(Channel mixerChannel, XTouchMiniMackieController controller, int controllerIndex) =>
            (this.mixerChannel, this.controller, this.controllerIndex) =
            (mixerChannel, controller, controllerIndex);

        internal async Task StartAsync()
        {
            mixerChannel.PropertyChanged += HandleChannelPropertyChanged;
            await mixerChannel.RequestDataOnce();
        }

        private void HandleChannelPropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            switch (e.PropertyName)
            {
                case nameof(Channel.On):
                    HandleChannelOnChanged();
                    break;
                case nameof(Channel.FaderLevel):
                    HandleChannelLevelChanged();
                    break;
            }
        }

        private void HandleChannelLevelChanged() =>
            controller.SetKnobRingState(controllerIndex, KnobRingStyle.Fan, (int) (mixerChannel.FaderLevel * 11));

        internal void HandleChannelOnChanged() =>
            controller.SetButtonLedState(controllerIndex, mixerChannel.On == 1 ? LedState.On : LedState.Off);

        private const int Scale = 100;
        internal void HandleKnobTurned(int value)
        {
            int velocity = value >= 0x41 ? -(value - 0x40) : value;
            var currentLevel = mixerChannel.FaderLevel * Scale;
            var newLevel = Math.Max(Math.Min(currentLevel + velocity, Scale), 0);
            mixerChannel.SetFaderLevel(newLevel / Scale);
        }

        public void HandleButtonPressed() =>
            mixerChannel.SetOn(1 - mixerChannel.On);
    }
}



================================================
FILE: XTouchMini/XTouchMini.MixerControl/MixerConnector.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using OscMixerControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using XTouchMini.Model;

namespace XTouchMini.MixerControl
{
    internal class MixerConnector : IDisposable
    {
        private readonly List<ControlledChannel> channels;
        private readonly Mixer mixer;
        private readonly Timer renewTimer;
        private readonly Channel mainOutput;

        internal MixerConnector(XTouchMiniMackieController controller, Mixer mixer)
        {
            this.mixer = mixer;
            controller.ButtonDown += HandleButtonDown;
            controller.KnobTurned += HandleKnobTurned;
            controller.FaderMoved += ChangeMainVolume;

            // TODO: Mapping from knob to input channel customization
            channels = Enumerable.Range(1, 8)
                .Select(index => new ControlledChannel(XAirDescriptor.Instance.CreateInputChannel(mixer, index), controller, index))
                .ToList();
            mainOutput = XAirDescriptor.Instance.CreateMainOutputChannel(mixer);
            renewTimer = new Timer(RefreshSubscriptionsAsync);
        }

        private async void RefreshSubscriptionsAsync(object state)
        {
            await mixer.SendXRemoteAsync();
            await mixer.SendRenewAllAsync();
        }

        private void HandleKnobTurned(object sender, KnobTurnedEventArgs e) =>
            channels[e.Knob - 1].HandleKnobTurned(e.Value);

        private void HandleButtonDown(object sender, ButtonEventArgs e)
        {
            // We only use the top row of buttons.
            if (e.Button >= 1 && e.Button <= 8)
            {
                channels[e.Button - 1].HandleButtonPressed();
            }
        }

        private void ChangeMainVolume(object sender, FaderEventArgs e) =>
            mainOutput.SetFaderLevel(e.Position / 127f);

        internal async Task StartAsync()
        {
            foreach (var channel in channels)
            {
                await channel.StartAsync().ConfigureAwait(false);
            }
            renewTimer.Change(TimeSpan.Zero, TimeSpan.FromSeconds(5));
        }

        public void Dispose() => renewTimer.Dispose();
    }
}



================================================
FILE: XTouchMini/XTouchMini.MixerControl/Program.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using Microsoft.Extensions.Logging.Abstractions;
using OscMixerControl;
using System;
using System.Threading;
using System.Threading.Tasks;
using XTouchMini.Model;

namespace XTouchMini.MixerControl
{
    class Program
    {
        static async Task Main()
        {
            // MIDI input name hard-coded as I think the chances of anyone else running this are slim...
            await using (var controller = await XTouchMiniMackieController.ConnectAsync(NullLogger.Instance, "X-TOUCH MINI"))
            {
                Console.WriteLine("Connected to controller");

                using (var mixer = new Mixer(XAirDescriptor.Instance))
                {
                    // IP address hard-coded as I think the chances of anyone else running this are slim...
                    mixer.Connect("192.168.1.41", 10024);
                    mixer.RegisterHandler("/info", (sender, message) => Console.WriteLine($"Mixer info response: {string.Join("/", message)}"));
                    await mixer.SendInfoAsync();

                    using (var connector = new MixerConnector(controller, mixer))
                    {
                        await connector.StartAsync();
                        await Task.Delay(Timeout.Infinite);
                    }
                }
            }
        }
    }
}



================================================
FILE: XTouchMini/XTouchMini.MixerControl/XTouchMini.MixerControl.csproj
================================================
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\OscMixerControl\OscMixerControl\OscMixerControl.csproj" />
    <ProjectReference Include="..\XTouchMini.Model\XTouchMini.Model.csproj" />
  </ItemGroup>

</Project>



================================================
FILE: XTouchMini/XTouchMini.Model/ButtonEventArgs.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Information provided when a button is pressed or released.
    /// </summary>
    public sealed class ButtonEventArgs
    {
        /// <summary>
        /// The button number, in the range 1-16, or 0
        /// if a layer button has been pressed in Mackie Control Mode.
        /// </summary>
        public int Button { get; }

        /// <summary>
        /// The layer of the button (or None in Mackie Control Mode, except
        /// for when the actual layer buttons have been pressed).
        /// </summary>
        public Layer Layer { get; }

        /// <summary>
        /// True if this event is for a button being pressed; false if
        /// it is for a button being released.
        /// </summary>
        public bool Down { get; }

        public ButtonEventArgs(int key, Layer layer, bool down) =>
            (Button, Layer, Down) = (key, layer, down);
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/FaderEventArgs.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Information provided when the fader is moved.
    /// </summary>
    public sealed class FaderEventArgs
    {
        /// <summary>
        /// Position of the fader, in the range 0-127.
        /// </summary>
        public int Position { get; }

        /// <summary>
        /// Logical layer of the fader (or None in Mackie Control Mode).
        /// </summary>
        public Layer Layer { get; }

        public FaderEventArgs(Layer layer, int position) =>
            (Layer, Position) = (layer, position);
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/KnobPressEventArgs.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Information provided when a knob is pressed or released.
    /// </summary>
    public sealed class KnobPressEventArgs
    {
        /// <summary>
        /// The knob number, in the range 1-8.
        /// </summary>
        public int Knob { get; }

        /// <summary>
        /// The layer of the knob (or None in Mackie Control Mode).
        /// </summary>
        public Layer Layer { get; }

        /// <summary>
        /// True if this event is for a knob being pressed; false if
        /// it is for a knob being released.
        /// </summary>
        public bool Down { get; }

        public KnobPressEventArgs(int knob, Layer layer, bool down) =>
            (Knob, Layer, Down) = (knob, layer, down);
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/KnobRingStyle.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// The style of lighting on the ring around a knob.
    /// </summary>
    public enum KnobRingStyle
    {
        /// <summary>
        /// A single light (or in standard mode, potentially two lights
        /// for mid-range values).
        /// </summary>
        Single = 0,

        /// <summary>
        /// Only valid for standard mode, and displays similarly to <see cref="Single"/>, but ensures
        /// that there is always at least one light on (whereas when the position is 0, all
        /// lights are off in Single).
        /// </summary>
        Pan = 1,

        /// <summary>
        /// Illuminates all lights from the left-most one to the specified value.
        /// </summary>
        Fan = 2,

        /// <summary>
        /// Illuminates lights from the center to whatever value is specified (so
        /// either only on the right, or only on the left).
        /// </summary>
        Spread = 3,

        /// <summary>
        /// Illuminates lights from the center, symmetrically - so 0 indicates
        /// no lights, 1 indiciates just the central light, 2 indicates the top three
        /// lights, etc.
        /// </summary>
        Trim = 4
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/KnobTurnedEventArgs.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Information provided when a knob is turned.
    /// </summary>
    public sealed class KnobTurnedEventArgs
    {
        /// <summary>
        /// The knob number, in the range 1-8.
        /// </summary>
        public int Knob { get; }

        /// <summary>
        /// The logical layer of the knob being turned (or None in Mackie Control Mode).
        /// </summary>
        public Layer Layer { get; }

        /// <summary>
        /// The reported knob value, in the range 0-127.
        /// In standard mode this is the knob position in the range 0-127.
        /// In Mackie Control Mode this is the velocity: values 0x01-0x07
        /// are clockwise, and values 0x41-0x47 are counter-clockwise.
        /// </summary>
        public int Value { get; }

        public KnobTurnedEventArgs(int knob, Layer layer, int value) =>
            (Knob, Layer, Value) = (knob, layer, value);
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/Layer.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Logical layer for a button or knob in Standard mode.
    /// Also used to identify layer buttons in Mackie Control mode.
    /// </summary>
    public enum Layer
    {
        /// <summary>
        /// No layer: device is in Mackie Control Mode.
        /// </summary>
        None = 0,

        /// <summary>
        /// Layer A in standard mode.
        /// </summary>
        LayerA = 1,

        /// <summary>
        /// Layer B in standard mode.
        /// </summary>
        LayerB = 2
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/LedState.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// Tristate type to indicate that an LED should be set to
    /// be off, on (steady) or blinking.
    /// </summary>
    public enum LedState
    {
        /// <summary>
        /// The LED should be off.
        /// </summary>
        Off,

        /// <summary>
        /// The LED should be on (steady).
        /// </summary>
        On,

        /// <summary>
        /// The LED should blink.
        /// </summary>
        Blinking
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/OperationMode.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

namespace XTouchMini.Model
{
    /// <summary>
    /// The operation mode of the device.
    /// </summary>
    public enum OperationMode : byte
    {
        /// <summary>
        /// Standard MIDI mode. In this mode, while the lights around the knobs
        /// and in the buttons can be controlled via software, they are also modified
        /// automatically, e.g. by pressing the buttons. Therefore this mode has
        /// less direct control - but is simpler to integrate with when custom display
        /// is not required.
        /// </summary>
        Standard = 0,

        /// <summary>
        /// Mackie Control Mode, providing more control over the visuals, but with
        /// less built-in behavior. The knobs do not have a logical "position", instead
        /// only reporting the velocity with which they are turned.
        /// </summary>
        MackieControl = 1
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/XTouchMini.Model.csproj
================================================
﻿<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netstandard2.1</TargetFramework>
    <LangVersion>9</LangVersion>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="managed-midi" Version="1.10.1" />
    <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="9.0.0" />
  </ItemGroup>

</Project>



================================================
FILE: XTouchMini/XTouchMini.Model/XTouchMiniController.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using Commons.Music.Midi;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace XTouchMini.Model
{
    /// <summary>
    /// Base class for X-Touch Mini controller classes, exposing common events.
    /// Derived classes raise the events, and expose mode-specific operations
    /// for controlling the lights of the X-Touch Mini.
    /// </summary>
    public abstract class XTouchMiniController : IAsyncDisposable
    {
        private readonly string portName;
        private IMidiInput inputPort;
        private IMidiOutput outputPort;
        private byte? lastMidiStatus;

        protected ILogger Logger { get; }
        public bool Connected => inputPort is object;

        public event EventHandler<KnobTurnedEventArgs> KnobTurned;
        public event EventHandler<KnobPressEventArgs> KnobDown;
        public event EventHandler<KnobPressEventArgs> KnobUp;
        public event EventHandler<ButtonEventArgs> ButtonDown;
        public event EventHandler<ButtonEventArgs> ButtonUp;
        public event EventHandler<FaderEventArgs> FaderMoved;

        protected XTouchMiniController(ILogger logger, string portName)
        {
            Logger = logger;
            inputCallback = HandleInputMessage;
            syncContext = SynchronizationContext.Current;
            this.portName = portName;
        }

        /// <summary>
        /// Sets the operation mode of the X-Touch Mini.
        /// </summary>
        public void SetOperationMode(OperationMode operationMode) =>
            SendMidiMessage(0xb0, 0x7f, (byte) operationMode);

        private readonly SynchronizationContext syncContext;
        private readonly SendOrPostCallback inputCallback;

        /// <summary>
        /// Checks whether or not there are ports with the given name. If there are, and the
        /// controller is not currently connected, a new connection is made. If there aren't,
        /// and the controller was previously connected, the existing ports are closed and
        /// the the controller is deemed disconnected. This method does not throw any exceptions
        /// if the port is found but can't be connected.
        ///
        /// This port is matched precisely if possible, but otherwise on a prefix basis.
        /// </summary>
        /// <returns>true if the controller has reconnected (from not being connected)</returns>
        public virtual async Task<bool> MaybeReconnect()
        {
            var manager = MidiAccessManager.Default;
            var inputs = manager.Inputs.ToList();
            var outputs = manager.Outputs.ToList();
            // Precise match first, then prefix match.
            var input = inputs.FirstOrDefault(p => p.Name == portName) ?? inputs.FirstOrDefault(p => p.Name.StartsWith(portName));
            var output = outputs.FirstOrDefault(p => p.Name == portName) ?? outputs.FirstOrDefault(p => p.Name.StartsWith(portName));

            bool wasConnected = this.inputPort is object && this.outputPort is object;
            bool nowConnected = input is object && output is object;
            if (wasConnected == nowConnected)
            {
                return false;
            }
            if (wasConnected)
            {
                await DisposeAsync().ConfigureAwait(false);
                Logger.LogInformation("Disconnected");
                return false;
            }
            try
            {
                var inputPort = await manager.OpenInputAsync(input.Id).ConfigureAwait(false);
                var outputPort = await manager.OpenOutputAsync(output.Id).ConfigureAwait(false);
                Logger.LogInformation("Connected");
                this.inputPort = inputPort;
                this.outputPort = outputPort;
                this.lastMidiStatus = null;
                // Ensure we process the message in a suitable synchronization context, if we have one.
                inputPort.MessageReceived += (sender, args) =>
                {
                    if (syncContext is null)
                    {
                        inputCallback(args);
                    }
                    else
                    {
                        syncContext.Post(inputCallback, args);
                    }
                };
            }
            catch (Exception ex)
            {
                // Deliberately swallow the exception. The port may be in use by another app, which
                // is equivalent to not existing, as far as we're concerned.
                // (This approach is always worrying, but for now it's probably the simplest option.
                // At least we can log it, though only at trace level.)
                Logger.LogTrace(ex, "Failed to reconnect");
                this.inputPort = null;
                this.outputPort = null;
                return false;
            }
            return true;
        }

        private void HandleInputMessage(object state)
        {
            var args = (MidiReceivedEventArgs) state;
            if (args.Length == 0)
            {
                return;
            }

            // Workaround for https://github.com/atsushieno/alsa-sharp/issues/2
            bool useCachedStatus = args.Data[args.Start] < 128;
            if (useCachedStatus && lastMidiStatus is null)
            {
                throw new InvalidOperationException("Received MIDI message with no status byte, and no cached status");
            }
            int dataOffset = useCachedStatus ? 1 : 0;
            int length = args.Length + dataOffset;
            byte[] data = new byte[length];
            if (useCachedStatus)
            {
                data[0] = lastMidiStatus.Value;
            }
            Buffer.BlockCopy(args.Data, args.Start, data, dataOffset, args.Length);
            // Cache the status (regardless of whether we've just received it or not).
            lastMidiStatus = data[0];
            HandleMidiMessage(data);
        }

        /// <summary>
        /// Must be overridden in derived classes to process MIDI messages.
        /// </summary>
        /// <param name="data">The MIDI message received. Never empty.</param>
        protected abstract void HandleMidiMessage(byte[] data);

        protected void OnKnobTurned(int knob, Layer layer, int value) =>
            KnobTurned?.Invoke(this, new KnobTurnedEventArgs(knob, layer, value));

        protected void OnKnobPressRelease(int knob, Layer layer, bool down)
        {
            EventHandler<KnobPressEventArgs> handler = down ? KnobDown : KnobUp;
            handler?.Invoke(this, new KnobPressEventArgs(knob, layer, down));
        }

        protected void OnButtonPressRelease(int button, Layer layer, bool down)
        {
            EventHandler<ButtonEventArgs> handler = down ? ButtonDown : ButtonUp;
            handler?.Invoke(this, new ButtonEventArgs(button, layer, down));
        }

        protected void OnFaderMoved(Layer layer, int position) =>
            FaderMoved?.Invoke(this, new FaderEventArgs(layer, position));

        public async ValueTask DisposeAsync()
        {
            await CloseAsync(inputPort).ConfigureAwait(false);
            await CloseAsync(outputPort).ConfigureAwait(false);
            inputPort = null;
            outputPort = null;

            async Task CloseAsync(IMidiPort port)
            {
                if (port is null)
                {
                    return;
                }
                try
                {
                    await port.CloseAsync().ConfigureAwait(false);
                }
                catch
                {
                    // Ignore - this happens more often than we'd like...
                }
            }
        }

        protected static async Task<T> ConnectAsync<T>(T controller) where T : XTouchMiniController
        {
            await controller.MaybeReconnect();
            return controller;
        }

        public void SendMidiMessage(params byte[] data) => outputPort?.Send(data, 0, data.Length, 0L);
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/XTouchMiniMackieController.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace XTouchMini.Model
{
    /// <summary>
    /// Controller for working with an X-Touch Mini in Mackie Control mode.
    /// </summary>
    public class XTouchMiniMackieController : XTouchMiniController
    {
        private static readonly byte[] MidiButtons =
        {
            // Placeholder so that the array can be accessed in a 1-based way
            0,
            // Top row
            0x59,
            0x5a,
            0x28,
            0x29,
            0x2a,
            0x2b,
            0x2c,
            0x2d,
            // Bottom row
            0x57,
            0x58,
            0x5b,
            0x5c,
            0x56,
            0x5d,
            0x5e,
            0x5f
        };

        private const byte LayerAMidiButton = 0x54;
        private const byte LayerBMidiButton = 0x55;

        public XTouchMiniMackieController(ILogger logger, string portName) : base(logger, portName)
        {
        }

        public override async Task<bool> MaybeReconnect()
        {
            var result = await base.MaybeReconnect().ConfigureAwait(false);
            if (result)
            {
                SetOperationMode(OperationMode.MackieControl);
            }
            return result;
        }

        protected override void HandleMidiMessage(byte[] data)
        {
            switch (data[0])
            {
                case 0xb0:
                    OnKnobTurned(data[1] - 0x0f, Layer.None, data[2]);
                    break;
                case 0xe8:
                    OnFaderMoved(Layer.None, data[2]);
                    break;
                case 0x90:
                    byte midiButton = data[1];
                    bool down = data[2] == 0x7f;
                    switch (midiButton)
                    {
                        case >= 0x20 and <= 0x27:
                            OnKnobPressRelease(midiButton - 0x1f, Layer.None, down);
                            break;
                        case LayerAMidiButton:
                            OnButtonPressRelease(0, Layer.LayerA, down);
                            break;
                        case LayerBMidiButton:
                            OnButtonPressRelease(0, Layer.LayerB, down);
                            break;
                        default:
                            int button = Array.IndexOf(MidiButtons, midiButton);
                            if (button != -1)
                            {
                                OnButtonPressRelease(button, Layer.None, down);
                            }
                            break;
                    }
                    break;
            }
        }

        public static Task<XTouchMiniMackieController> ConnectAsync(ILogger logger, string portName) =>
            ConnectAsync(new XTouchMiniMackieController(logger, portName));

        public void SetButtonLedState(int button, LedState state)
        {
            byte midiButton = MidiButtons[button];
            SetButtonLedStateImpl(midiButton, state);
        }

        public void SetLayerButtonLedState(Layer layer, LedState state)
        {
            switch (layer)
            {
                case Layer.LayerA:
                    SetButtonLedStateImpl(LayerAMidiButton, state);
                    break;
                case Layer.LayerB:
                    SetButtonLedStateImpl(LayerBMidiButton, state);
                    break;
            }
        }

        private void SetButtonLedStateImpl(byte midiButton, LedState state)
        {
            byte midiState = state switch
            {
                LedState.Off => 0,
                LedState.On => 0x7f,
                LedState.Blinking => 0x01,
                _ => 0
            };
            SendMidiMessage(0x90, midiButton, midiState);
        }

        public void SetKnobRingState(int knob, KnobRingStyle style, int value)
        {
            int midiValue = style switch
            {
                KnobRingStyle.Single => value,
                KnobRingStyle.Trim => value + 16,
                KnobRingStyle.Fan => value + 32,
                KnobRingStyle.Spread => value + 48,
                _ => 0
            };
            SendMidiMessage(0xb0, (byte) (0x2f + knob), (byte) midiValue);
        }

        /// <summary>
        /// Resets all the buttons and knob ring lights to off.
        /// </summary>
        public void Reset()
        {
            for (int i = 1; i <= 8; i++)
            {
                SetKnobRingState(i, KnobRingStyle.Fan, 0);
            }
            for (int i = 1; i <= 16; i++)
            {
                SetButtonLedState(i, LedState.Off);
            }
        }
    }
}



================================================
FILE: XTouchMini/XTouchMini.Model/XTouchMiniStandardController.cs
================================================
﻿// Copyright 2021 Jon Skeet. All rights reserved.
// Use of this source code is governed by the Apache License 2.0,
// as found in the LICENSE.txt file.

using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace XTouchMini.Model
{
    /// <summary>
    /// Controller for working with an X-Touch Mini in Standard mode.
    /// </summary>
    public class XTouchMiniStandardController : XTouchMiniController
    {
        private XTouchMiniStandardController(ILogger logger, string portName) : base(logger, portName)
        {
        }

        /// <summary>
        /// Connects to an X-Touch Mini and sets it to Standard mode.
        /// </summary>
        /// <param name="logger">The logger to use in this controller.</param>
        /// <param name="portName">The MIDI name of the input/output ports.</param>
        public static Task<XTouchMiniStandardController> ConnectAsync(ILogger logger, string portName) =>
            ConnectAsync(new XTouchMiniStandardController(logger, portName));

        public override async Task<bool> MaybeReconnect()
        {
            var result = await base.MaybeReconnect().ConfigureAwait(false);
            if (result)
            {
                SetOperationMode(OperationMode.Standard);
            }
            return result;
        }

        protected override void HandleMidiMessage(byte[] data)
        {
            switch (data[0])
            {
                case 0xba:
                    // Sliders: 0x09 for layer A, 0x0a for layer B
                    if (data[1] == 0x09 || data[1] == 0x0a)
                    {
                        OnFaderMoved(data[1] == 0x09 ? Layer.LayerA : Layer.LayerB, data[2]);
                    }
                    // Knobs, 0x01-0x08 for layer A, 0x0b-0x12 for layer B
                    else
                    {
                        OnKnobTurned(data[1] % 0xa, data[1] < 0x0b ? Layer.LayerA : Layer.LayerB, data[2]);
                    }
                    break;
                case 0x8a:
                case 0x9a:
                    byte note = data[1];
                    bool down = data[0] == 0x9a;
                    if (note < 8)
                    {
                        // Map 0x00-0x07 to knobs 1-8 (layer A)
                        OnKnobPressRelease(note + 1, Layer.LayerA, down);
                    }
                    else if (note < 0x18)
                    {
                        // Map 0x08-0x17 to buttons 1-16 (layer A)
                        OnButtonPressRelease(note - 7, Layer.LayerA, down);
                    }
                    else if (note < 0x20)
                    {
                        // Map 0x18-0x1f to knobs 1-8 (layer B)
                        OnKnobPressRelease(note - 0x17, Layer.LayerB, down);
                    }
                    else
                    {
                        // Map 0x20-0x2f to buttons 1-16 (layer B)
                        OnButtonPressRelease(note - 0x1f, Layer.LayerB, down);
                    }
                    break;
            }
        }

        public void SetActiveLayer(Layer layer) =>
            SendMidiMessage(0xc0, (byte) (layer - 1));

        public void SetKnobPosition(int knob, int position) =>
            SendMidiMessage(0xba, (byte) knob, (byte) position);

        public void SetKnobRingStyle(int knob, KnobRingStyle style) =>
            SendMidiMessage(0xb0, (byte) knob, (byte) style);

        /// <summary>
        /// Sets the ring lights for a knob.
        /// </summary>
        /// <param name="knob">The knob to set the lights for</param>
        /// <param name="state">The overall state: off, on, or blinking</param>
        /// <param name="value">The individual value (0 for off, </param>
        public void SetKnobRingLights(int knob, LedState state, int value)
        {
            byte midiValue = (state, value) switch
            {
                (LedState.Off, _) => 0,
                (_, 0) => 0,
                (LedState.On, 14) => 27,
                (LedState.Blinking, 14) => 28,
                (LedState.On, >= 1 and <= 13) => (byte) value,
                (LedState.Blinking, >= 1 and <= 13) => (byte) (value + 13),
                _ => 0
            };
            SendMidiMessage(0xb0, (byte) (knob + 8), midiValue);
        }

        public void SetButtonState(int button, LedState state) =>
            SendMidiMessage(0x90, (byte) (button - 1), (byte) state);
    }
}


