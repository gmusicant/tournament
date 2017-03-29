import React, { Component} from 'react'
import { Field } from 'redux-form';

import _ from 'lodash';

export default class TournamentForm extends Component {

    showdDeleteButton(deleteButton, tournament) {
        if (tournament && tournament.hash) {

            const areYouShure = (event) => {
                if (confirm('Are you sure you want to delete this tournament ?')) {
                    deleteButton(tournament.hash, event);
                }
            }

            return (<div className="form-group">
                <h4>
                    Danger section. We can't restore tournament if you delete it.
                </h4>
                <a className="btn btn-danger btn-xs" type="submit"
                    onClick={areYouShure}>
                    Delete
                </a>
            </div>)
        } else {
            return '';
        }
    }

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
                    </div>
                    {this.showdDeleteButton(deleteButton, tournament)}
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