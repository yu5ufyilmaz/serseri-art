-- Serseri Art - Koleksiyon sistemi için şema + örnek veri
-- Supabase SQL Editor'da bir kez çalıştır.

-- 1) KOLEKSİYON ALANLARI
alter table works
    add column if not exists is_collection_item boolean not null default false;

alter table works
    add column if not exists collection_tag text;

create index if not exists works_is_collection_item_idx on works (is_collection_item);
create index if not exists works_collection_tag_idx on works (collection_tag);

-- 2) ÖRNEK SANATÇILAR
insert into artists (name, department, bio, image_url)
select
    'Mira Aksoy',
    'Dijital Kolaj',
    'Sokak kültürü, tipografi ve analog dokuları dijital kolajlarla birleştiriyor.',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1000&q=80'
where not exists (
    select 1 from artists where lower(name) = lower('Mira Aksoy')
);

insert into artists (name, department, bio, image_url)
select
    'Arda Demir',
    'Serigrafi',
    'Monokrom baskılar, gürültülü kompozisyonlar ve sınırlı adet üretimler.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80'
where not exists (
    select 1 from artists where lower(name) = lower('Arda Demir')
);

-- 3) ÖRNEK KATEGORİLER
insert into categories (name)
select x.name
from (
    values
        ('Koleksiyon: Grafik'),
        ('Koleksiyon: Serigrafi'),
        ('Standart: Tuval')
) as x(name)
where not exists (
    select 1 from categories c where lower(c.name) = lower(x.name)
);

-- 4) KOLEKSİYONDA GÖRÜNECEK ÖRNEK ÜRÜNLER
insert into works (title, price, artist_id, category_id, image_url, is_collection_item, collection_tag)
select
    'Neon Protest #01',
    3250,
    a.id,
    c.id,
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    true,
    'SPRING 26 DROP'
from artists a
join categories c on lower(c.name) = lower('Koleksiyon: Grafik')
where lower(a.name) = lower('Mira Aksoy')
  and not exists (
      select 1 from works w where lower(w.title) = lower('Neon Protest #01')
  );

insert into works (title, price, artist_id, category_id, image_url, is_collection_item, collection_tag)
select
    'Asfalt Mektupları',
    4100,
    a.id,
    c.id,
    'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=1200&q=80',
    true,
    'SPRING 26 DROP'
from artists a
join categories c on lower(c.name) = lower('Koleksiyon: Serigrafi')
where lower(a.name) = lower('Arda Demir')
  and not exists (
      select 1 from works w where lower(w.title) = lower('Asfalt Mektupları')
  );

insert into works (title, price, artist_id, category_id, image_url, is_collection_item, collection_tag)
select
    'Hızlı Çizgi Manifestosu',
    2950,
    a.id,
    c.id,
    'https://images.unsplash.com/photo-1513366208864-87536b8bd7b4?auto=format&fit=crop&w=1200&q=80',
    true,
    'LIMITED CAPSULE'
from artists a
join categories c on lower(c.name) = lower('Koleksiyon: Grafik')
where lower(a.name) = lower('Mira Aksoy')
  and not exists (
      select 1 from works w where lower(w.title) = lower('Hızlı Çizgi Manifestosu')
  );

-- 5) ANA SAYFADA GÖRÜNMEYECEK NORMAL ÜRÜN ÖRNEĞİ
insert into works (title, price, artist_id, category_id, image_url, is_collection_item, collection_tag)
select
    'Sessiz Tuval',
    2100,
    a.id,
    c.id,
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
    false,
    null
from artists a
join categories c on lower(c.name) = lower('Standart: Tuval')
where lower(a.name) = lower('Arda Demir')
  and not exists (
      select 1 from works w where lower(w.title) = lower('Sessiz Tuval')
  );

-- 6) RASTGELE GORSELLI EK KOLEKSIYON URUNLERI
insert into works (title, price, artist_id, category_id, image_url, is_collection_item, collection_tag)
select
    seed.title,
    seed.price,
    a.id,
    c.id,
    seed.image_url,
    true,
    seed.collection_tag
from (
    values
        ('Urban Echo No.1', 3650, 'Mira Aksoy', 'Koleksiyon: Grafik', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', 'SPRING 26 DROP'),
        ('Silent Riot Poster', 2890, 'Mira Aksoy', 'Koleksiyon: Grafik', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80', 'SPRING 26 DROP'),
        ('Nocturne Serif', 3320, 'Mira Aksoy', 'Koleksiyon: Grafik', 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=1200&q=80', 'LIMITED CAPSULE'),
        ('Concrete Poetry', 3780, 'Mira Aksoy', 'Koleksiyon: Grafik', 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&w=1200&q=80', 'LIMITED CAPSULE'),
        ('After Midnight Silk', 4250, 'Arda Demir', 'Koleksiyon: Serigrafi', 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80', 'SPRING 26 DROP'),
        ('Noise Study 02', 3150, 'Arda Demir', 'Koleksiyon: Serigrafi', 'https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?auto=format&fit=crop&w=1200&q=80', 'SPRING 26 DROP'),
        ('Redline Archive', 3420, 'Arda Demir', 'Koleksiyon: Serigrafi', 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80', 'LIMITED CAPSULE'),
        ('Transit Grid', 3990, 'Arda Demir', 'Koleksiyon: Serigrafi', 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?auto=format&fit=crop&w=1200&q=80', 'LIMITED CAPSULE')
) as seed(title, price, artist_name, category_name, image_url, collection_tag)
join artists a on lower(a.name) = lower(seed.artist_name)
join categories c on lower(c.name) = lower(seed.category_name)
where not exists (
    select 1 from works w where lower(w.title) = lower(seed.title)
);
