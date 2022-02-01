import React from 'react';
import './finance.scss';
import FormFinance from '../../components/FormFinance/FormFinance';
import FormMonth from '../../components/FormMonth/FormMonth';

class Finance extends React.Component<{}> {
  render() {
    return (
      <main className="finance">
        <div className="finance__content-container">
          <div className="finance__forms">
            {/* При добавлении новой формы нужно указать name и прописать его в this.state.arrNamesForms FormFinance.tsx */}
            <div className="finance__form-finance">
              <FormFinance name="formFinance" />
            </div>
            <div className="finance__form-finance">
              <FormFinance name="formExpenses" />
            </div>
            <div className="finance__form-finance">
              <FormMonth />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Finance;
