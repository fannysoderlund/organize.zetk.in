import { connect } from 'react-redux';
import React from 'react';

import PaneBase from '../../panes/PaneBase';
import OfficialList from '../../misc/officiallist/OfficialList';
import { createSelection } from '../../../actions/selection';
import { retrieveOfficials } from '../../../actions/official';


@connect(state => ({ officials: state.officials }))
export default class OfficialsPane extends PaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveOfficials());
    }

    renderPaneContent() {
        let officialList = this.props.officials.officialList;
        let admins = officialList.items
            .filter(i => i.data.role === 'admin')
            .map(i => i.data);

        let organizers = officialList.items
            .filter(i => i.data.role === 'organizer')
            .map(i => i.data);

        return [
            <div className="OfficialsPane-admins" key="admins">
                <h1>Administrators</h1>
                <p>{
                    "Administrators have full access to all aspects of the " +
                    "organization."
                }</p>
                <OfficialList officials={ admins }
                    onAdd={ this.onAdd.bind(this, 'admin') }
                    onRemove={ this.onRemove.bind(this) }
                    onSelect={ this.onSelect.bind(this, 'admin') }/>
            </div>,

            <div className="OfficialsPane-organizers" key="organizers">
                <h1>Organizers</h1>
                <p>{
                    "Organizers have enough access to perform the day-to-day " +
                    "tasks related to, for example, managing a running campaign " +
                    "or an active call assignment."
                }</p>
                <OfficialList officials={ organizers }
                    onAdd={ this.onAdd.bind(this, 'organizer') }
                    onRemove={ this.onRemove.bind(this) }
                    onSelect={ this.onSelect.bind(this, 'organizer') }/>
            </div>
        ];
    }

    onAdd(role, official) {
        if (official) {
            // TODO Add
            console.log('Add official', official);
        }
        else {
            let instructions = 'Select people to be added as officials';

            let action = createSelection('person', null, instructions, ids => {
                console.log('SELECTED', ids);
            });

            this.props.dispatch(action);
            this.openPane('selectpeople', action.payload.id);
        }
    }


    onRemove(official) {
        console.log('REMOVE', official);
    }

    onSelect(role, official) {
        console.log('SELECT', role, official);
    }
}
