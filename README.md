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

| Sample | Description |
|--------|-------------|
| **HelloWorld** | Echoes messages back to clients. The simplest App with no persistence. |
| **ProtobufService** | Community voting between two options. Demonstrates building a service without persistence. |
| **DataStorage** | Simple task list with persistence. Shows two data-access implementations: Knex + SQLite and Prisma + SQLite. |
| **CommunityLog** | Demonstrates the Community Log API for writing audit/activity logs. |
| **SuggestionBox** | Shared suggestion box with voting. The most complete sample showing client UI, multiple services, and database persistence. |

To run a sample App, follow the steps to [build](https://docs.rootapp.com/docs/app-docs/get-started/build-your-app/) and [test](https://docs.rootapp.com/docs/app-docs/get-started/test-your-app/) an App.

## Sample Bots

| Sample | Description |
|--------|-------------|
| **HelloWorld** | Echoes messages back to the originating channel. The simplest Bot. |
| **AllChannelBroadcast** | Broadcasts a message to all text channels. Demonstrates enumerating channel groups and channels. |
| **NewMemberWelcome** | Posts a welcome message when a new member joins. Shows handling the member-joined event. |
| **RoleList** | Lists community roles and member roles. Shows retrieving role information. |
| **RoleAssignment** | Auto-assigns a role to members who post messages. Shows programmatic role assignment. |
| **ResetChannelDescription** | Clears a voice channel's description when empty. Demonstrates WebRTC participant events. |

To run a sample Bot, follow the steps to [build](https://docs.rootapp.com/docs/bot-docs/get-started/build-your-bot/) and [test](https://docs.rootapp.com/docs/bot-docs/get-started/test-your-bot/) a Bot.
