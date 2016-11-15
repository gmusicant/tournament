import React, { Component} from 'react'
import { Field } from 'redux-form';

import _ from 'lodash';

export default class TournamentForm extends Component {

    render() {

        const { handleSubmit, saveTournament, cancelButton, deleteButton, tournament } = this.props;

        const h2Title = tournament && tournament.title ? tournament.title : 'new';

        return (
            <div className="container">
                <h2>Tournament {h2Title}</h2>
                <form>
                    <div className="form-group">
                        <Field name="hash" component="input" type="hidden"/>
                        <div>
                            <label htmlFor="title">Title</label>
                            <Field name="title" component="input" type="text" placeholder="Enter title" />
                        </div>
                        <div>
                            <label htmlFor="type">Type</label>
                            <Field name="type" component="select">
                                <option value="swiss">swiss</option>
                                <option value="olympic">olympic</option>
                            </Field>
                        </div>
                    </div>
                    <div className="form-group">
                        <h4>
                            Danger section. We can't restore tournament if you delete it.
                        </h4>
                        <a className="btn btn-danger btn-xs" type="submit"
                            onClick={deleteButton.bind(this, tournament.hash)}>
                            Delete
                        </a>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-default" type="submit"
                            onClick={cancelButton}>
                            Cancel
                        </button>
                        &nbsp;
                        <button className="btn btn-success" type="submit"
                            onClick={handleSubmit(data => {
                                saveTournament(data);
                            })}>
                            Save
                        </button>
                    </div>
                </form>
            </div>)

      }

}