https://master--steam-fans-arts.netlify.app
Projeto relacionado à o front-end steam-fans, este projeto teve como ideia principal fazer um web-site aonde os usuarios, podem, criar suas categorias de jogos favoritos, e postar suas Fan-arts, cada categoria é unica, cada postagem também é unica

O projeto teve intuito na prática do NodeJs puro, para adquirir um conhecimento mais aprofundado de como a ferramente funciona.

Modelos do banco de dados :

![image](https://github.com/Kimichubi/database-steam/assets/145304741/12674a1e-245e-4d72-9a17-dd45cc8e97f8)


Tabela users:

![image](https://github.com/Kimichubi/database-steam/assets/145304741/92178f06-203f-477b-bf94-f710184f6da4)

Tabela categorys:

![image](https://github.com/Kimichubi/database-steam/assets/145304741/3ac9f5a7-de70-4efd-915e-74b861e3eed5)

Tabela posts:

![image](https://github.com/Kimichubi/database-steam/assets/145304741/731178cf-1751-4d5c-85ca-ef308dcad47f)

Tabela favorites:

![image](https://github.com/Kimichubi/database-steam/assets/145304741/d786ed97-4a41-4b49-84ac-9fe87b7f1beb)

Tabela Likes:

![image](https://github.com/Kimichubi/database-steam/assets/145304741/8396f3d4-aacf-4a65-ab37-73490fefa455)

Modelos e Relações
Modelo users
O modelo users representa os usuários do sistema.

Campos:

id: Identificador único do usuário.

email: Email do usuário (único).

name: Nome do usuário.

password: Senha do usuário.

createdAt: Data de criação do registro.

updatedAt: Data de atualização do registro.

confirmationCode: Código de confirmação do usuário.

confirmed: Status de confirmação do usuário.

Relações:

favorites: Relação de um para muitos com o modelo favorites.

likes: Relação de um para muitos com o modelo likes.

posts: Relação de um para muitos com o modelo post.

followingCategories: Relação de muitos para muitos com o modelo category.

Modelo category

O modelo category representa as categorias que podem ser associadas aos favoritos, likes e posts.

Campos:

id: Identificador único da categoria.

name: Nome da categoria (único).

createdAt: Data de criação do registro.

updatedAt: Data de atualização do registro.

imageUrl: URL da imagem da categoria.

Relações:

favorites: Relação de um para muitos com o modelo favorites.

likes: Relação de um para muitos com o modelo likes.

posts: Relação de um para muitos com o modelo post.

followers: Relação de muitos para muitos com o modelo users.

Modelo post

O modelo post representa as postagens feitas pelos usuários.

Campos:

id: Identificador único do post.

name: Nome do post.

fanArtUrl: URL da fan art associada ao post (único).

authorId: Identificador do autor do post.

categoryId: Identificador da categoria associada ao post.

createdAt: Data de criação do registro.

updatedAt: Data de atualização do registro.

Relações:

favorites: Relação de um para muitos com o modelo favorites.

likes: Relação de um para muitos com o modelo likes.

author: Relação de muitos para um com o modelo users.

category: Relação de muitos para um com o modelo category.

Modelo favorites

O modelo favorites representa os favoritos dos usuários.

Campos:

id: Identificador único do favorito.

userId: Identificador do usuário que favoritou.

postId: Identificador do post favoritado.

createdAt: Data de criação do registro.

updatedAt: Data de atualização do registro.

categoryId: Identificador da categoria associada ao favorito.

Relações:

category: Relação de muitos para um com o modelo category.

post: Relação de muitos para um com o modelo post.

user: Relação de muitos para um com o modelo users.

Modelo likes

O modelo likes representa os likes dos usuários.

Campos:

id: Identificador único do like.

userId: Identificador do usuário que deu like.

postId: Identificador do post que recebeu o like.

createdAt: Data de criação do registro.

updatedAt: Data de atualização do registro.

categoryId: Identificador da categoria associada ao like.

Relações:

category: Relação de muitos para um com o modelo category.

post: Relação de muitos para um com o modelo post.

user: Relação de muitos para um com o modelo users.

Relações entre Modelos

Um para Muitos (1:N):

users para favorites: Um usuário pode ter muitos favoritos.

users para likes: Um usuário pode ter muitos likes.

users para posts: Um usuário pode criar muitos posts.

category para favorites: Uma categoria pode estar associada a muitos favoritos.

category para likes: Uma categoria pode estar associada a muitos likes.

category para posts: Uma categoria pode ter muitos posts.

Muitos para Muitos (M:N):

users para category (followingCategories e followers): Um usuário pode seguir muitas categorias e uma categoria pode ser seguida por muitos usuários.

Este modelo foi projetado para capturar as interações principais entre usuários, posts, categorias, favoritos e likes, garantindo uma estrutura eficiente e flexível par
a o armazenamento e recuperação de dados.


Rotas API :

User

![image](https://github.com/Kimichubi/database-steam/assets/145304741/cb05ded9-ba73-4076-afa1-d0215552f484)

Posts

![image](https://github.com/Kimichubi/database-steam/assets/145304741/f77a0a37-ba89-43cc-b54f-6c0afb05564d)


Category

![image](https://github.com/Kimichubi/database-steam/assets/145304741/875be1f4-957b-4c91-a594-4cfec944957f)

Like 

![image](https://github.com/Kimichubi/database-steam/assets/145304741/0d8417c1-7fe1-47c0-8708-d74e79a66b31)

Favority

![image](https://github.com/Kimichubi/database-steam/assets/145304741/160bebeb-4bbf-4bc2-b038-b3ab67c2a86a)

























