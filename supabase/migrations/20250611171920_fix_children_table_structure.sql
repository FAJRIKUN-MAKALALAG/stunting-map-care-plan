-- Drop existing table if exists
drop table if exists children;

-- Create children table with correct structure
create table children (
    id uuid default uuid_generate_v4() primary key,
    nama text not null,
    nik text,
    tanggal_lahir date,
    jenis_kelamin text,
    nama_ibu text,
    alamat text,
    dusun text,
    berat_badan numeric,
    tinggi_badan numeric,
    lingkar_kepala numeric,
    catatan text,
    z_score_bb numeric,
    z_score_tb numeric,
    status text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    user_id uuid references auth.users(id)
);

-- Add RLS (Row Level Security) policies
alter table children enable row level security;

-- Create policy to allow all users to view all children data
create policy "Anyone can view all children data"
    on children for select
    using (true);

-- Create policy to allow users to insert their own children
create policy "Users can insert their own children"
    on children for insert
    with check (auth.uid() = user_id);

-- Create policy to allow users to update their own children
create policy "Users can update their own children"
    on children for update
    using (auth.uid() = user_id);

-- Create policy to allow users to delete their own children
create policy "Users can delete their own children"
    on children for delete
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index children_user_id_idx on children(user_id);
create index children_nama_idx on children(nama);
create index children_dusun_idx on children(dusun);
create index children_status_idx on children(status);

-- Insert sample data
INSERT INTO children (
    nama,
    nik,
    tanggal_lahir,
    jenis_kelamin,
    nama_ibu,
    alamat,
    dusun,
    berat_badan,
    tinggi_badan,
    lingkar_kepala,
    catatan,
    z_score_bb,
    z_score_tb,
    status,
    user_id
) VALUES 
(
    'Budi Santoso',
    '1234567890123456',
    '2020-01-15',
    'male',
    'Siti Aminah',
    'Jl. Merdeka No. 123',
    'Airmadidi Bawah',
    12.5,
    85.0,
    45.0,
    'Anak sehat dan aktif',
    -1.2,
    -1.5,
    'Normal',
    '10b5e88d-df41-4da6-8b68-600a72cbf5c4'
),
(
    'Ani Wijaya',
    '2345678901234567',
    '2019-06-20',
    'female',
    'Rina Sari',
    'Jl. Sudirman No. 45',
    'Dimembe',
    10.8,
    78.5,
    43.5,
    'Perlu perhatian khusus untuk asupan gizi',
    -2.1,
    -2.3,
    'Stunting',
    '10b5e88d-df41-4da6-8b68-600a72cbf5c4'
),
(
    'Dewi Putri',
    '3456789012345678',
    '2021-03-10',
    'female',
    'Linda Susanti',
    'Jl. Gatot Subroto No. 67',
    'Kalawat',
    11.2,
    80.0,
    44.0,
    'Pertumbuhan normal',
    -0.8,
    -1.0,
    'Normal',
    '10b5e88d-df41-4da6-8b68-600a72cbf5c4'
);
