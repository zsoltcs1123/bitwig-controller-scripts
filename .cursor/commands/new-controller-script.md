# New Controller Script implementation

## Input

- Gather the necessary specification for the script from the user.
- The user has to provide the name of the script, the desired functionality, and the MIDI and/or additional control specifications of the device.
- In some cases, you can get the control scheme for a controller from the already existing scripts. If the user doesn't provide the specs, look around the repo for examples.
- The user might not describe the full feature set up front. That is fine - go step by step and guide them through the process.
- Before implementing, get up to date on important concepts from the file `@./docs/important-concepts`.
- Ask clarifying questions until the direction is completely clear and all the necessary context has been provided.


## Implentation Process

- Always break down the implementation into smaller parts that can be implemented and tested step by step. Do not try to one-shot the full controller logic.
- Always start with a simple skeleton that just loads the script and displays a welcome debug message. Ask the user to test it.
- Then you implement one feature, and the user tests that feature in Bitwig. 
- If needed, iterate until the user is satisfied, and only then move on to the next feature.
- When all features are implemented and the script is complete, write a user-friendly README about the features and usage.

