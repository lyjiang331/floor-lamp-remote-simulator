# Floor Lamp Remote Simulator

**Name:** [Your name]

## Appliance inspiration

My appliance is the remote control for my floor lamp. The lamp can be turned on and off, and it can also be set to turn off automatically after one hour. The remote lets me change both brightness and color temperature, from a warm yellow light to a cool white light. It also has five preset modes: Office, Sleep, Study, K, and Baby.

**Insert the photo `remote-inspiration.jpg` here.**

## Design notes

I wanted to simulate three important qualities of this appliance: flexible control, convenient preset choices, and automatic shutoff. The most important part was not making a perfect picture of the remote. Instead, I focused on the logic connecting each button to a change in the lamp’s state.

The main states are:

- Power: on or off
- Brightness: 10% to 100%
- Color temperature: five steps from 2700K warm yellow to 6500K cool daylight
- Mode: Custom, Office, Sleep, Study, K, or Baby
- One-hour timer: set or off

When the lamp is off, the adjustment buttons are disabled because the real lamp cannot show changes while it is off. When the lamp is on, the brightness buttons change the value in 10% steps, and the Warm and Cool buttons move through the five color-temperature states. Each quick mode changes brightness and color at the same time. For example, Sleep mode uses a very dim warm light, while Office mode uses a bright cool light.

## Process write-up

### Variables and states

I used variables such as `isOn`, `brightness`, `temperatureIndex`, `currentMode`, and `timerIsSet`. Before coding, I thought about the remote as a collection of buttons. During the process, I started to understand it as a system that needs to remember its current condition. That change in thinking helped me decide which variables were necessary.

### Modeling transitions

I modeled a transition as a user action that changes one or more variables. Pressing Power changes `isOn` from `false` to `true` or back again. Pressing the brightness buttons adds or subtracts 10. Pressing a mode button changes several states at once. After each transition, one `renderLamp()` function updates the text, colors, button states, and lamp illustration so that the screen always matches the stored state.

### How control flow helped

`if` and `else if` statements let the simulator behave differently depending on its state. They prevent brightness from going above 100% or below 10%. They also assign different brightness and color values to each preset. This made the model feel more like a real appliance rather than a group of unrelated buttons.

### How AI helped

I used Codex as a thinking and coding partner. I first described the basic idea as brightness and color control. After looking more closely at my actual remote, I corrected the first version by naming the five real modes: Office, Sleep, Study, K, and Baby. Codex helped translate my plain-language interactions into JavaScript event listeners and state changes. I did not treat the first output as final; I compared it with the real remote, supplied missing details, and tested whether the visible state changed correctly.

### What I tried, tested, and revised

The starting files only had sample buttons that changed text and background colors. I replaced that example with a complete lamp state model. I tested the sequence of turning the lamp on, raising brightness, choosing Baby mode, and setting the one-hour timer. The state readout changed from 50% to 60%, then Baby mode changed it to 30% and 2700K warm yellow. The timer label also changed to show that the one-hour timer was active.

One useful lesson was that a shortcut button is not a completely separate kind of logic. It is a convenient way to change several existing state variables together. I also learned that interface feedback matters: without the percentage, Kelvin value, active-mode outline, and status message, it would be difficult to know whether the logic worked.

## Links

- **GitHub repository:** [Paste your repository URL here]
- **Codex transcript:** [Paste the shared conversation URL here]
