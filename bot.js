// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
var fs = require('fs');

const { ActivityTypes } = require('botbuilder');

class MyBot {
    constructor(userState) {
        this.realJSON = JSON.parse(fs.readFileSync('surrealista.json', 'utf8'))
        this.fakeJSON = JSON.parse(fs.readFileSync('sensacionalista.json', 'utf8'))
    }

    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            await turnContext.sendActivity(`${ this.realJSON[0].title }`);

            if (turnContext.activity.text === "inicio") {
            }
        }
        else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            const activity = turnContext.activity;
            if (activity.membersAdded) {
                // Iterate over all new members added to the conversation.
                for (const idx in activity.membersAdded) {
                    if (activity.membersAdded[idx].id !== activity.recipient.id) {
                        const welcomeMessage = `Bem Vindo ${ activity.membersAdded[idx].name }! ` +
                            `Esse bot vai mandar noticias aleatorias, elas sao verdadeiras ou falsas?`;
                        await turnContext.sendActivity(welcomeMessage);
                        await this.sendSuggestedActions(turnContext);
                    }
                }
            }
        }
        else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}

module.exports.MyBot = MyBot;
