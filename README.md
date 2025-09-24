# Root developer samples

This repository contains a collection of example Root Apps and Bots.

## Repository structure

```
Samples repository
│
├── Apps
│   ├── sample-app
│   │   ├── client
│   │   │   └── src
│   │   ├── server
│   │   │   └── src
│   │   └── networking
│   │       └── src
│   │
│   └── (other samples)
│
└── Bots
    ├── sample-bot
    │   └── src
    │
    └── (other samples)
```

## Sample Apps

- **HelloWorld:** Sends back the incoming message, no persistence. The simplest App.
- **ProtobufService:** Community voting on two options. Demonstrates how to build a simple service without persistence.
- **DataStorage:** Simple task-list with persistence. Demonstrates two different data-access layer implementations.
- **CommunityLog:** - API demonstration App for Community Log.
- **SuggestionBox:** Shared suggestion box with voting. The most complete sample. Shows client UI, services, and persistence.

<!--
- **MemberProfilePopup:** Partitions clients into groups for breakout sessions. Shows the Root profile popup in the client.
- **Themes:** User-selectable theming. Demonstrates the Root CSS variables and the client-side theme APIs.
-->

To run a sample App, follow the steps to [build](https://docs.rootapp.com/docs/app-docs/get-started/build-your-app/) and [test](https://docs.rootapp.com/docs/app-docs/get-started/test-your-app/) an App.

## Sample Bots

- **HelloWorld:** Sends back the incoming message to the originating channel. The simplest Bot.
- **AllChannelBroadcast** Sends the incoming message to all text channels. Demonstrates how to enumerate all channel groups and channels.
- **NewMemberWelcome:** Posts a welcome message to the community default channel when a new member joins. Shows how to handle the member-joined event.
- **RoleList:** Lists community roles and member roles. Shows how to retrieve community and user role information.
- **RoleAssignment:** Assigns a new role to active members that post messages in the community. Shows how to programmatically assign a role.
- **ResetChannelDescription:** Sets the description of a voice channel to empty string when the last participant leaves the call. Demonstrates WebRTC APIs.

To run a sample Bot, follow the steps to [build](https://docs.rootapp.com/docs/bot-docs/get-started/build-your-bot/) and [test](https://docs.rootapp.com/docs/bot-docs/get-started/test-your-bot/) a Bot.
