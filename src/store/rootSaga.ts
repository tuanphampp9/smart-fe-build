import { all } from 'redux-saga/effects'
import topicSaga from './sagas/topic-saga'
import categorySaga from './sagas/category-saga'
import publisherSaga from './sagas/publisher-saga'
import languageSage from './sagas/language-saga'
import warehouseSaga from './sagas/warehouse-saga'
import authorSaga from './sagas/author-saga'
export default function* rootSaga() {
  yield all([
    topicSaga(),
    categorySaga(),
    publisherSaga(),
    languageSage(),
    warehouseSaga(),
    authorSaga(),
  ])
}
