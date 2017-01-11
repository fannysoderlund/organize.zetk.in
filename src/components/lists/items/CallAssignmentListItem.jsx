import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ParticipantList from './elements/ParticipantList'

import {
    retrieveCallAssignmentStats,
    retrieveCallAssignmentCallers,
} from '../../../actions/callAssignment';


@connect(() => ({}))
export default class CallAssignmentListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    componentDidMount() {
        let assignment = this.props.data;
        if (!assignment.statsItem) {
            this.props.dispatch(retrieveCallAssignmentStats(assignment.id));
        }

        if (!assignment.callerList) {
            this.props.dispatch(retrieveCallAssignmentCallers(assignment.id));
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let assignment = nextProps.data;
        if (!assignment.statsItem) {
            this.props.dispatch(retrieveCallAssignmentStats(assignment.id));
        }

        if (!assignment.callerList) {
            this.props.dispatch(retrieveCallAssignmentCallers(assignment.id));
        }
    }

    render() {
        let assignment = this.props.data;
        let targetStats = null;
        let goalStats = null;
        let participantIndicator = null;
        const assignmentDateStart = new Date(assignment.start_date);
        const assignmentDateEnd = new Date(assignment.end_date);
        const inPast = (assignmentDateStart < (new Date()) ? true : false);

        const classNames = cx({
            'CallAssignmentListItem': true,
            'past': inPast
        });

        const assignmentDateSpan =
            assignmentDateStart.getDate()
            + "/" + assignmentDateStart.getMonth()
            + " - "
            + assignmentDateEnd.getDate()
            + "/" + assignmentDateEnd.getMonth();

        if (assignment.statsItem && assignment.statsItem.isPending) {
            targetStats = <LoadingIndicator/>;
            goalStats = <LoadingIndicator/>;
        }
        else if (assignment.statsItem && assignment.statsItem.data) {
            let stats = assignment.statsItem.data;
            targetStats = (
                <h1 key="targetStatsHeader">
                    { stats.num_target_matches }
                </h1>
            );
            goalStats = (
                <h1 key="goalStatsHeader">
                    { stats.num_remaining_targets }
                </h1>
            );
        }

        if (assignment.callerList && assignment.callerList.isPending) {
            participantIndicator = <LoadingIndicator/>
        }
        else if (assignment.callerList) {
            let participants = assignment.callerList.items.map(p => p.data);
            const count = (participants.length)? participants.length : "0";
            participantIndicator =  (
                <span className="CallAssignmentListItem-infoCallers">
                    <i className="fa fa-user"></i>
                    <Msg id="lists.callAssignmentList.item.info.callers"
                        values={{ count }}/>
                </span>
            );
        }

        return (
            <div className={ classNames }
                onClick={ () => {this.props.onItemClick(assignment)} }>
                <div className="ListItem-date">
                    <span className="date">
                        { assignmentDateSpan }</span>
                </div>
                <div className="CallAssignmentListItem-info">
                    <h3 className="CallAssignmentListItem-infoTitle">
                        { assignment.title }</h3>
                    { participantIndicator }
                </div>
                <div className="CallAssignmentListItem-stats">
                    <div className="CallAssignmentListItem-targetStats">
                        { targetStats }</div>
                    <div className="CallAssignmentListItem-goalStats">
                        { goalStats }</div>
                </div>
            </div>
        );
    }
}
