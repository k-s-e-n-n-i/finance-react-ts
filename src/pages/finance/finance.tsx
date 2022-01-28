import React from 'react';
import './finance.scss';
import FormFinance from '../../components/FormFinance/FormFinance';

class Finance extends React.Component<{}> {
  render() {
    return (
      <main className="finance">
        <div className="finance__content-container">
          <div className="finance__form-search-num">
            {/* При добавлении новой формы нужно указать name и прописать его в this.state.arrNamesForms FormFinance.tsx */}
            <div className="finance__form-finance">
              <FormFinance name="formFinance" />
            </div>
            <div className="finance__form-finance">
              <FormFinance name="formExpenses" />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Finance;
