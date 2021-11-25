import json

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import Follow, Post, User


@login_required
def get_current_user(request):
    if request.method != "GET":
        return JsonResponse({"error": "Request must be GET request"})
    else:
        serialized_user = request.user.serialize()
        return JsonResponse({"user": serialized_user})


@csrf_exempt
@login_required
def index(request):
    return render(request, "network/index.html")


@csrf_exempt
@login_required
def react_dynamic_router(request, id):
    return render(request, "network/index.html")


def logout_(request):
    logout(request)

    return HttpResponseRedirect(reverse("login"))


def login_(request):

    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, "Invalid credentials")
            return HttpResponseRedirect(reverse("login"))

    return render(request, "network/login.html")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            messages.error(request, "Passwords do not match")
            return HttpResponseRedirect(reverse("register"))
        elif password == confirmation:
            try:
                user = User(username=username, email=email)
                user.set_password(password)
                user.save()
            except IntegrityError:
                messages.error(request, "Email or username is already taken")
                return HttpResponseRedirect(reverse("register"))
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


# API GOES HERE


@csrf_exempt
@login_required
def new_post(request):

    if request.method != "POST":
        return JsonResponse({"error": "Post request required"})
    else:
        data = json.loads(request.body)

        title = data["title"]
        body = data["body"]
        author = request.user

        if title == "" or body == "":
            return JsonResponse({"error": "All fields are required"})

        post = Post(title=title, body=body, author=author)
        post.save()

    return JsonResponse({"message": "Post created successfully"})


@login_required
def all_posts(request, page):

    if request.method == "POST":
        return JsonResponse({"error": "GET request required"})
    else:

        posts = Post.objects.all().order_by("-date_created")
        # paginate
        paginator = Paginator(posts, 10)
        page_n = paginator.get_page(page)
        posts = page_n.object_list

        serialized_posts = []
        for post in posts:
            if post.likes.filter(pk=request.user.pk).exists():
                serialized_post = post.serialize()
                serialized_post["is_liked"] = True
                serialized_posts.append(serialized_post)
            else:
                serialized_post = post.serialize()
                serialized_post["is_liked"] = False
                serialized_posts.append(serialized_post)

        return JsonResponse(
            {
                "posts": serialized_posts,
                "hasNext": page_n.has_next(),
                "hasPrev": page_n.has_previous(),
            }
        )


@login_required
def get_post(request, post_id):

    if request.method != "GET":
        return JsonResponse({"error": "request must be post request"})
    else:
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"error": f"Post with the id {post_id} does not exist"})
        else:
            serialized_post = post.serialize()
            if post.likes.filter(pk=request.user.pk).exists():
                serialized_post["is_liked"] = True
            else:
                serialized_post["is_liked"] = False

            return JsonResponse({"post": serialized_post})


@csrf_exempt
@login_required
def like_or_unlike(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.method != "PUT":
        return JsonResponse({"error": "Request must be PUT request"})
    else:
        data = json.loads(request.body)
        if data["is_liked"] == False:
            post.likes.add(request.user)
        else:
            post.likes.remove(request.user)

        post_after_request = Post.objects.get(pk=post_id)
        serialized_post = post_after_request.serialize()
        if post_after_request.likes.filter(pk=request.user.pk).exists():
            serialized_post["is_liked"] = True
        else:
            serialized_post["is_liked"] = False
    return JsonResponse({"post": serialized_post})


@login_required
@csrf_exempt
def edit_post(request, post_id):
    if request.method != "PUT":
        return JsonResponse({"error": "Request must be PUT request"})
    else:
        post = Post.objects.get(pk=post_id)
        if request.user.id == post.author.id:
            data = json.loads(request.body)
            title = data["title"]
            body = data["body"]

            post.title = title
            post.body = body
            post.save()

            updated_post = Post.objects.get(pk=post_id)

            return JsonResponse({"post": updated_post.serialize()})
        else:
            return JsonResponse(
                {"error": "You do not have the ability to edit this post"}
            )


@csrf_exempt
@login_required
def get_profile(request):

    if request.method == "GET":
        try:
            user = User.objects.get(pk=request.user.pk)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"User with the id: {request.user.pk} does not exist"}
            )
        else:
            following = Follow.objects.filter(user=user)
            followers = Follow.objects.filter(following=user)

            posts_following = []
            for f in following:
                posts = Post.objects.filter(author=f.following)
                for post_ in posts:
                    posts_following.append(post_)

            new_posts = []
            for post in posts_following:
                serialized_post = post.serialize()
                if post.likes.filter(pk=request.user.pk).exists():
                    serialized_post["is_liked"] = True
                else:
                    serialized_post["is_liked"] = False
                new_posts.append(serialized_post)

            posts_by_user = []

            for p in Post.objects.filter(author=request.user).order_by("-date_created"):
                posts_by_user.append(p)


            serialized_posts_by_user = []
            for p in posts_by_user:
                serialized = p.serialize()
                if p.likes.filter(pk=request.user.pk).exists():
                    serialized['is_liked'] = True 
                else:
                    serialized['is_liked'] = False
                serialized_posts_by_user.append(serialized)

            return JsonResponse(
                {
                    "followers": [follower.serialize() for follower in followers],
                    "following": [user_.serialize() for user_ in following],
                    "posts": new_posts,
                    "posts_": serialized_posts_by_user,
                }
            )

    elif request.method == "PUT":

        data = json.loads(request.body)

        if "unfollow" in data.keys():
            following = User.objects.get(username=data["following_username"])
            f = Follow.objects.get(user=request.user, following=following)
            f.delete()

        elif "follow" in data.keys():
            following = User.objects.get(username=data["following_username"])
            f = Follow(user=request.user, following=following)
            f.save()

    return JsonResponse({"response": "OK"})
