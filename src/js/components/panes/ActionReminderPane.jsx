import React from 'react/addons';

import PaneBase from './PaneBase';
import Form from '../forms/Form';
import TextArea from '../forms/inputs/TextArea';
import Avatar from '../misc/Avatar';
import Person from '../misc/elements/Person';
import Action from '../misc/elements/Action';


export default class ActionReminderPane extends PaneBase {
    getPaneTitle() {
        return 'Action reminders';
    }

    getPaneSubTitle(data) {
        return data.action?
            <Action action={ data.action }/> : null;
    }

    componentDidMount() {
        this.listenTo('participant', this.forceUpdate);
        this.listenTo('action', this.forceUpdate);

        const actionId = this.getParam(0);
        this.getActions('participant').retrieveParticipants(actionId);
        this.getActions('action').retrieveAction(actionId);
    }

    getRenderData() {
        const aid = this.getParam(0);
        const participantStore = this.getStore('participant');
        const participants = participantStore.getParticipants(aid) || [];

        return {
            action: this.getStore('action').getAction(aid),
            remindedParticipants: participants.filter(p => p.reminder_sent),
            newParticipants: participants.filter(p => !p.reminder_sent)
        };
    }

    renderPaneContent(data) {
        var reminderForm = null;
        if (data.newParticipants.length) {
            reminderForm = [
                <h3>Rend reminders to participants</h3>,
                <ul key="newParticipantsList"
                    className="actionreminderpane-newparticipants">
                {data.newParticipants.map(function(participant) {
                    return <li><Avatar person={ participant }/></li>;
                })}
                </ul>,
                <Form key="reminderForm" ref="reminderForm"
                    onSubmit={ this.onRemindersSubmit.bind(this) }>
                    <TextArea name="message" label="Custom additional info"/>
                    <input type="submit" value="Send all"/>
                </Form>
            ];
        }

        var remindedList = null;
        if (data.remindedParticipants.length) {
            remindedList = [
                <h3>Reminders sent</h3>,
                <ul key="remindedList" className="actionreminderpane-reminded">
                {data.remindedParticipants.map(function(participant) {
                    const timeLabel = Date.utc.create(participant.reminder_sent)
                        .format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}');

                    const onClick = this.onPersonClick.bind(this, participant);

                    return (
                        <li>
                            <Avatar person={ participant }/>
                            <Person person={ participant } onClick={ onClick }/>
                            <span className="timestamp">
                                { timeLabel }</span>
                        </li>
                    );
                }, this)}
                </ul>
            ];
        }

        return [
            reminderForm,
            remindedList
        ];
    }

    onRemindersSubmit(ev) {
        ev.preventDefault();
        const actionId = this.getParam(0);
        this.getActions('reminder').sendAllActionReminders(actionId);
    }

    onPersonClick(person) {
        this.openPane('person', person.id);
    }
}
