import React from 'react';

import FluxComponent from '../FluxComponent';
import Form from './Form';
import TextArea from './inputs/TextArea';
import TextInput from './inputs/TextInput';


export default class ActivityForm extends FluxComponent {
    render() {
        var activity = this.props.activity || {};

        return (
            <Form ref="form" {...this.props }>
                <TextInput label="Title" name="title"
                    initialValue={ activity.title }/>
                <TextArea label="Information" name="info_text"
                    initialValue={ activity.info_text }/>

                <input key="submit" type="submit"/>
            </Form>
        );
    }

    getValues() {
        return this.refs.form.getValues();
    }

    getChangedValues() {
        return this.refs.form.getChangedValues();
    }
}
