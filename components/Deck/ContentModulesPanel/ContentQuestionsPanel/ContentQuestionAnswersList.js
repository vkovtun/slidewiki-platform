import PropTypes from 'prop-types';
import React from 'react';
import ContentQuestionAnswersItem from './ContentQuestionAnswersItem';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import loadQuestion from '../../../../actions/questions/loadQuestion';

class ContentQuestionAnswersList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // isEditButtonClicked: false,
            showCorrect: false,
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    }

    handleButtonClick() {
        this.setState({
            showCorrect: !this.state.showCorrect,
        });
    }

    handleEditButtonClick() {
        // this.setState({
        //     isEditButtonClicked: true
        // });

        this.context.executeAction(loadQuestion, {qstid: this.props.qstid});
    }

    render() {
        const creatorId = this.props.DeckViewStore.creatorData._id;
        const userId = this.props.UserProfileStore.userid;
        const editButton = (
            <button className="ui compact button primary" onClick={this.handleEditButtonClick}>
                <i className="edit icon" />
                Edit question
            </button>
        );

        const showEditButton = () => {
            if(this.props.editPermission) {
                return editButton;
            }
            return null;
        };

        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionAnswersItem answer={node} name={'answer' + index} key={index}/>
            );
        });

        let correctAnswers = this.props.items.filter((item) => item.correct).map((node, index) => {
            return (
              <div key={index} className="header">
                  {node.answer}
              </div>
            );
        });

        let explanation = (this.props.explanation && this.props.explanation.trim() !== '') ?
            <div className="description">
                <p>
                    <label><strong>Explanation:</strong></label> {this.props.explanation}
                </p>
            </div>
        : '';
        let showButtonLabel = this.state.showCorrect ? 'Hide answer' : 'Show answer';
        let answers = (
            <div className="ui two column stackable grid">
                <div className="column">
                    <div className="ui grouped fields">
                        <fieldset>
                            {list}
                        </fieldset>
                    </div>
                </div>
                <div className="column">
                  <button className="ui compact button primary" onClick={this.handleButtonClick}>
                    <i className=" help circle icon" />
                    {showButtonLabel}
                  </button>
                  {showEditButton()}
                  <div className="ui item">
                    <div className="content">
                      {this.state.showCorrect ? correctAnswers : null}
                      {this.state.showCorrect ? explanation : null}
                    </div>
                  </div>
              </div>
            </div>
        );

        return (
            <div ref="contentquestionanswersList">
                <div className="ui relaxed list">
                    {answers}
                </div>
            </div>
        );
    }
}

ContentQuestionAnswersList.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

ContentQuestionAnswersList = connectToStores(ContentQuestionAnswersList, [ContentQuestionsStore, DeckViewStore, UserProfileStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});

export default ContentQuestionAnswersList;
