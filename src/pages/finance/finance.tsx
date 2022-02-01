import React from 'react';
import './finance.scss';
import FormFinance from '../../components/forms/FormFinance';
import FormMonth from '../../components/forms/FormMonth';
import FormTotal from '../../components/FormTotal/FormTotal';

class Finance extends React.Component<{}> {
  render() {
    return (
      <main className="finance">
        <div className="finance__content-container">
          <div className="finance__forms">
            {/* При добавлении новой формы FormFinance нужно указать name и прописать его в this.state.arrNamesForms FormFinance.tsx */}
            <div className="finance__form-finance">
              <FormFinance name="formFinance" colorForm="pink" />
            </div>
            <div className="finance__form-finance">
              <FormFinance name="formAccumulation" />
            </div>

            <div className="finance__form-finance">
              <FormTotal />
            </div>

            <div className="finance__form-finance">
              <FormFinance name="formExpenses" colorForm="blue" />
            </div>
            <div className="finance__form-finance finance__form-finance_right">
              <FormMonth colorForm="blue" />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Finance;
