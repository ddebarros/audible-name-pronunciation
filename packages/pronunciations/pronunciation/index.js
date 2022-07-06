const Router = require('./Router');
const listPronunciations = require('./routes/pronunciations/listPronunciations');
const getPronunciation = require('./routes/pronunciations/getPronunciation');
const addPronunciation = require('./routes/pronunciations/addPronunciation');
const createSignedPost = require('./routes/storage/createSignedPost');
const removePronunciation = require('./routes/pronunciations/removePronunciation');

console.log(process.env)
const router = new Router();
router.get('/', listPronunciations);
router.get('/{pronunciation_id}', getPronunciation);
router.post('/', addPronunciation);
router.delete('/{pronunciation_id}', removePronunciation);
router.post('/signed-post', createSignedPost)

exports.main = router.main;