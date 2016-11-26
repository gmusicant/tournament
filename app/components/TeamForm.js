import React, { Component} from 'react'
import { Field } from 'redux-form';

import _ from 'lodash';

export default class TeamForm extends Component {

    showdDeleteButton(deleteButton, tournamentHash, team) {
        if (team && team.hash && tournamentHash) {

            const areYouShure = (event) => {
                if (confirm('Are you sure you want to delete this team ?')) {
                    deleteButton(tournamentHash, team.hash, event);
                }
            }

            return (<div className="form-group">
                <h4>
                    Danger section. We can't restore team if you delete it.
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

        const { handleSubmit, saveTeam, cancelButton, deleteButton, team, tournamentHash } = this.props;

        const h2Title = team && team.title ? team.title : 'new';

        return (
            <div className="container">
                <h2>Team {h2Title}</h2>
                <form>
                    <div className="form-group">
                        <Field name="hash" component="input" type="hidden"/>
                        <div>
                            <label htmlFor="title">Title</label>
                            <Field name="title" component="input" type="text" placeholder="Enter title" />
                        </div>
                    </div>
                    {this.showdDeleteButton(deleteButton, tournamentHash, team)}
                    <div className="form-group">
                        <button className="btn btn-default" type="submit"
                            onClick={cancelButton}>
                            Cancel
                        </button>
                        &nbsp;
                        <button className="btn btn-success" type="submit"
                            onClick={handleSubmit(data => {
                                saveTeam(data);
                            })}>
                            Save
                        </button>
                    </div>
                </form>
            </div>)

      }

}