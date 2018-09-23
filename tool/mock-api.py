import flask
import json
import time
import os


this_root = os.path.dirname(__file__)


app = flask.Flask(__name__)


@app.route('/post')
def post_list():
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    post_infos = []
    for num in range(int(limit / 2) + 1):
        post_infos.extend([
            {
                'slug': 'test %s left' % (offset + num),
                'title': 'test title %s left' % (offset + num),
                'cover': 'https://dn-jolla.qbox.me/sailfish-os-2.2.0-update/cover.jpg',
                'description': 'description',
                'author': 'test_author',
            },
            {
                'slug': 'test %s right' % (offset + num),
                'title': 'test title %s right' % (offset + num),
                'cover': 'https://dn-jolla.qbox.me/gemini/cover.jpg',
                'description': 'description2',
                'author': 'test_author',
            },
        ])
    post_infos = post_infos[:limit]
    result = {
        'total': 100,
        'limit': limit,
        'post_infos': post_infos
    }

    time.sleep(0.5)

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/post/<path:slug>')
def post(slug):
    with open(os.path.join(this_root, 'post_content.html'), 'r', encoding='utf-8') as f:
        result = {
            'title': 'Sailfish系统2.2.0 Mouhijoki已向提早更新用户放送(%s)' % slug,
            'headerimg': 'https://dn-jolla.qbox.me/sailfish-os-2.2.0-update/banner.jpg',
            'description': '<p>Xperia X支持指纹、修正拍照，安卓支持性能提升，添加Emoji支持</p>',
            'content': f.read(),
            'author': 'test author',
        }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )
    # result = {
    #     'message': 'error msg',
    # }
    #
    # return flask.Response(
    #     json.dumps(result),
    #     # 'error',
    #     status=500,
    #     mimetype='application/json'
    # )


@app.route('/post/<path:slug>/comment', methods=('GET',))
def comment_list(slug):
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'comments': [
            {
                'id': offset + 1,
                'nickname': 'testnickname',
                # 'email': 'test_email@test.com',
                'content': 'test comment content %s' % (offset + 1),
                'inserted_at': '2018-08-08',
            },
            {
                'id': offset + 2,
                'nickname': 'testnickname',
                # 'email': 'test_email@test.com',
                'content': 'test comment content %s' % (offset + 2),
                'inserted_at': '2018-08-08',
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/post/<path:slug>/comment', methods=('POST',))
def comment_add(slug):
    req_body = flask.request.get_data()
    req = json.loads(req_body.decode('utf-8'))

    result = dict(req)

    result['id'] = int(str(time.time()).replace('.', ''))

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/tie')
def tie_list():
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'ties': [
            {
                'slug': 'test tie %s' % (offset + 1),
                'content': 'tie content {}'.format(offset + 1),
            },
            {
                'slug': 'test tie %s' % (offset + 2),
                'content': 'tie content {}'.format(offset + 2),
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/tie/<path:slug>')
def tie(slug):
    result = {
        'content': 'test tie content {}'.format(slug)
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/tie/<path:slug>/comment')
def tie_comment(slug):

    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'comments': [
            {
                'id': offset + 1,
                'nickname': 'testnickname',
                'email': 'test_email@test.com',
                'content': 'test tie {} comment content {}'.format(slug, (offset + 1)),
            },
            {
                'id': offset + 2,
                'nickname': 'testnickname',
                'email': 'test_email@test.com',
                'content': 'test tie {} comment content {}'.format(slug, (offset + 2)),
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/tie/<path:slug>/comment', methods=('POST',))
def tie_comment_add(slug):
    req_body = flask.request.get_data()
    req = json.loads(req_body.decode('utf-8'))

    result = dict(req)

    result['id'] = int(str(time.time()).replace('.', ''))

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


app.run(port=8082, debug=True)
