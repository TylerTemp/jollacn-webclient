import flask
import json
import time


app = flask.Flask(__name__)


@app.route('/api/post')
def article_list():
    args = flask.request.args
    offset = int(args.get('offset', 0))
    limit = min((50, int(args.get('limit', 50))))
    result = {
        'total': 100,
        'limit': limit,
        'article_infos': [
            {
                'slug': 'test %s' % (offset + 1),
                'title': 'test title %s' % (offset + 1),
                'description': 'description',
                'author': 'test_author',
            },
            {
                'slug': 'test %s' % (offset + 2),
                'title': 'test title %s' % (offset + 2),
                'description': 'description2',
                'author': 'test_author',
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/api/post/<path:slug>')
def article(slug):
    result = {
        'title': 'test title {}'.format(slug),
        'content': 'test post content',
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


@app.route('/api/post/<path:slug>/comment', methods=('GET',))
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
                'email': 'test_email@test.com',
                'content': 'test comment content %s' % (offset + 1),
            },
            {
                'id': offset + 2,
                'nickname': 'testnickname',
                'email': 'test_email@test.com',
                'content': 'test comment content %s' % (offset + 2),
            },
        ]
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/api/post/<path:slug>/comment', methods=('POST',))
def comment_add(slug):
    req_body = flask.request.get_data()
    req = json.loads(req_body.decode('utf-8'))

    result = dict(req)

    result['id'] = int(str(time.time()).replace('.', ''))

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/api/tie/<path:slug>')
def tie(slug):
    result = {
        'content': 'test tie content {}'.format(slug)
    }

    return flask.Response(
        json.dumps(result),
        mimetype='application/json'
    )


@app.route('/api/tie/<path:slug>/comment')
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


@app.route('/api/tie/<path:slug>/comment', methods=('POST',))
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
