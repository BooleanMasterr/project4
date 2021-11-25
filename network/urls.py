from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("logout/", views.logout_, name="logout"),
    path("login/", views.login_, name="login"),
    path("register/", views.register, name="register"),
    path("posts/pages/<int:page>/", views.all_posts, name="all-posts"),
    path("create-post/", views.new_post, name="new-post"),
    path("get-post/<str:post_id>/", views.get_post, name="get-post"),
    path("request-like/<str:post_id>/", views.like_or_unlike, name="request-like"),
    path("editPost/<str:post_id>/", views.edit_post, name="edit-post"),
    path("get-current-user/", views.get_current_user, name="get-current-user"),
    path("getProfile/", views.get_profile, name="get-profile"),
    # REACT URLS
    path("new-post/", views.index, name="react-new-post"),
    path("posts/<str:id>/", views.react_dynamic_router, name="rect-post-details"),
    path("edit-post/<str:id>/", views.react_dynamic_router, name="react-post-edit"),
    path("profile/", views.index, name="react-user-profile"),
    path("following/", views.index, name="following")
]
