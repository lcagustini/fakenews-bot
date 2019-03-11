// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
var fs = require('fs');

const { ActivityTypes, MessageFactory } = require('botbuilder');

class MyBot {
    constructor(userState) {
        this.realJSON = JSON.parse(fs.readFileSync('surrealista.json', 'utf8'))
        this.fakeJSON = JSON.parse(fs.readFileSync('sensacionalista.json', 'utf8'))
        this.score = 0;
        this.turn = 0;
    }

    generateRandomInteger(min, max) {
        return Math.floor(min + Math.random()*(max + 1 - min))
    }

    async onTurn(turnContext) {
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        if (turnContext.activity.type === ActivityTypes.Message) {
            //await turnContext.sendActivity(`${ this.realJSON[0].title }`);
            const text = turnContext.activity.text;

            // If the `text` is in the Array, a valid color was selected and send agreement.
            if (text === this.currentNews) {
                await turnContext.sendActivity(`Acertou mizeravi!`);
                this.score += 1;
            }
            else {
                await turnContext.sendActivity('Erroooooou!');
            }
            this.turn += 1;

            // After the bot has responded send the suggested actions.
            await this.sendSuggestedActions(turnContext);
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

    async sendSuggestedActions(turnContext) {
        var realOrFake = this.generateRandomInteger(0, 1);

        await turnContext.sendActivity(`Acertos: ${this.score} Turnos: ${this.turn}`);
        if (realOrFake === 0) {
            let index = this.generateRandomInteger(0, this.fakeJSON.length-1);
            this.currentNews = "FakeNews";
            await turnContext.sendActivity(this.fakeJSON[index].title);
        }
        else {
            let index = this.generateRandomInteger(0, this.realJSON.length-1);
            this.currentNews = "Verdade";
            await turnContext.sendActivity(this.realJSON[index].title);
        }

        var reply = MessageFactory.suggestedActions(['Verdade', 'FakeNews'], 'O que acha dessa noticia?');
        await turnContext.sendActivity(reply);
    }
}

module.exports.MyBot = MyBot;
